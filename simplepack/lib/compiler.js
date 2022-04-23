// simplepack 御用编译器!!!
// 支持:
// 1. 模块构建
// 2. 输出到磁盘

// 这里就得用 commonjs 了啊，这是服务端啊!!!! 🐘

const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');

module.exports = class Compiler {

  // 接收用户写的 simplepack.config.js，处理配置项
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }

  // 构建的入口
  run() {
    // 从入口模块 (./src/index.js) 开始构建
    const entryModule = this.buildModule(this.entry, true);

    this.modules.push(entryModule);

    // 从入口模块开始，构建所有依赖的模块
    // 每循环一次检查一下 this.modules.length，以处理数组增长的情况。
    for (let i = 0; i < this.modules.length; i++) {
      this.modules[i].dependencies.forEach(d => {
        // 数组增长
        this.modules.push(this.buildModule(d));
      });
    }

    // 生成文件
    this.emitFiles();
  }

  /**
   * 构建单个模块
   * @param {string} pathInEntryAndFilenameInNormalModule  入口模块是 path，普通模块是 filename
   * @param {boolean} isEntry 是否入口模块
   */
  buildModule(pathInEntryAndFilenameInNormalModule, isEntry) {
    let ast;

    if (isEntry) {
      ast = getAST(pathInEntryAndFilenameInNormalModule);
    }
    else {
      const filePath = path.resolve(process.cwd(), 'src', pathInEntryAndFilenameInNormalModule);
      ast = getAST(filePath);
    }

    return {
      // 模块名 或 入口模块路径
      filename: pathInEntryAndFilenameInNormalModule,
      // 依赖列表
      dependencies: getDependencies(ast),
      // 本模块的 ES5 代码
      source: transform(ast)
    }
  }

  // 输出文件到磁盘
  emitFiles() {
    const outputFilePath = path.resolve(this.output.path, this.output.filename);
    console.log(this.modules);

    /**
     * {
     *    'index.js': function(require, module, exports) { ES5 code... },
     * 
     *    'greeting.js': function(require, module, exports) { ES5 code... },
     * 
     *    ...
     * }
     */
    let modules = '';
    this.modules.forEach(m => {
      modules += `"${m.filename}": function(require, module, exports) { ${m.source} },`
    })

    const bundle = `(function(modules) {
      /**
       *     核心是  fn(require, module, module.exports) 改写了构建后代码的 require，
       * 这样执行代码查找依赖(用户代码的require)的时候，会执行自定义 require 函数，找自定义modules对象，
       * require 里又调了 modules 对象的属性值(执行函数)，填充自定义 module.exports，
       * 最后 require 返回 module.exports。整个执行过程，就是在 modules 对象的各个属性值 (函数)里 跳来跳去。
       */

      function require(filename) {
        // 取出每个执行函数，里面是构建好的 ES5 用户代码
        var fn = modules[filename];

        // 用 simplepack 的 module / module.exports，覆盖用户代码的 module / module.exports
        var module = { exports: {} };

        // 执行用户代码
        fn(require, module, module.exports);

        return module.exports;
      }

      // 从入口模块开始执行
      require("${this.entry}");

    })({ ${modules} })`;

    fs.writeFileSync(outputFilePath, bundle, 'utf-8');
  }

}