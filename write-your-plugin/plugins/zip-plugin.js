const JSZip = require('jszip');
const path = require('path');
const RawSource = require('webpack-sources').RawSource;

const zip = new JSZip();

module.exports = class ZipPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 发布一个异步事件 -- ZipPlugin
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      // 新建一个文件夹用于压缩
      const folderToZip = zip.folder(this.options.filename);
      // 遍历webpack构建的文件
      for (let filename in compilation.assets) {
        // 经过webpack处理的 项目代码
        const sourceCode = compilation.assets[filename].source();
        // 将代码加入待压文件夹
        folderToZip.file(filename, sourceCode);
      }

      zip.generateAsync({
        // 压缩成 buffer
        type: 'nodebuffer'
      }).then(buffer => {
        // 通过 compilation 输出结果
        compilation.assets[this.options.filename + '.zip'] = new RawSource(buffer);
        // 调用weback提供的callback
        callback();
      });
    });
  }
}