// process.env.NODE_ENV 是 webpack 加的，就是 webpack.config.js 的 mode。

if (process.env.NODE_ENV === 'production') {
  // 生产环境打包
  module.exports = require('./dist/large-number.min.js');
} else {
  // 开发环境打包
  module.exports = require('./dist/large-number.js');
}
