// 将 文件内容 转换为 模块

const loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');

// loader 是一个函数
module.exports = function (source) {

  // 获取用户传给本 loader 的参数
  const option = loaderUtils.getOptions(this);

  // 异步 loader 回调
  const callback = this.async();

  // console.log('name', option);

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2028/g, '\\u2029')

  // return `export default ${json}`;


  fs.readFile(path.resolve(__dirname, './async.txt'), 'utf-8', (err, data) => {
    // 异步 loader
    callback(null, data);
  });
}