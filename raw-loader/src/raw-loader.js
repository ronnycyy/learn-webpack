// 将 文件内容 转换为 模块

// loader 是一个函数
module.exports = function (source) {

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2028/g, '\\u2029')


  return `export default ${json}`;
}