const loaderUtils = require('loader-utils');

module.exports = function (source) {
  // console.log('loader a exectuted!', new Date());

  const url = loaderUtils.interpolateName(this, '[name].[ext]', source);

  console.log('文件', url);
  console.log('内容', source);

  // 像 output 一样打到 dist 里
  // 把  source 输出到 url 里
  this.emitFile(url, source);

  return source;
}
