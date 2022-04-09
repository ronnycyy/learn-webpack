// 这里是别人引用的本包的入口，所以可以用当前 webpack 打包的 mode，来确定走哪个包。

// process.env.NODE_ENV 是 webpack 加的，就是 webpack.config.js 的 mode。
if (process.env.NODE_ENV === 'production') {
  // 生产环境打包
  module.exports = require('./dist/large-number.min.js');
} else {
  // 开发环境打包
  module.exports = require('./dist/large-number.js');
}
