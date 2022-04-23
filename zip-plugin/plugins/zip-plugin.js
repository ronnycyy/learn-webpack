const JSZip = require('jszip');
const path = require('path');
const RawSource = require('webpack-sources').RawSource;

const zip = new JSZip();

module.exports = class ZipPlugin {
  constructor(options) {
    // 用户传给 plugin 的配置
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      // emit 生成文件阶段

      const folder = zip.folder(this.options.filename);

      /**
       * compilation.assets
       * {
       *   'main.js': { _value: '打包后的代码' }
       * }
       * 
       */
      for (const filename in compilation.assets) {
        const source = compilation.assets[filename].source();
        // 打包后的代码，都放到文件夹里
        folder.file(filename, source);
      }

      zip.generateAsync({
        type: 'nodebuffer'
      }).then((c) => {
        // 生成的 zip 包文件名称可以通过插件传入
        const outputPath = path.resolve(compilation.options.output.path, this.options.filename + '.zip');

        // 绝对 zip 相对于 绝对dist 的路径
        // offline.zip
        const outputRelativePath = path.relative(
          compilation.options.output.path,
          outputPath
        );

        // 做成 webpack 格式的输出资源
        compilation.assets[outputRelativePath] = new RawSource(c);
        callback();
      })

    });
  }
}