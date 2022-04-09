const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // 不管什么版，先把压缩去掉，在 optimization 里决定是否压缩
  mode: 'none',
  /**  ======  打包📦两个版本  ======= */
  entry: {
    // 非压缩版本
    'large-number': './src/index.js',
    // 压缩版本
    'large-number.min': './src/index.js'
  },
  output: {
    // 1. large-number.js
    // 2. large-number.min.js
    filename: '[name].js',
    // 库的名字
    library: 'largeNumber',
    // UMD 既可以在前端也可以在后端使用，UMD 同时支持 CommonJS 和 AMD，也支持老式的全局变量规范。
    // https://qiweiy.me/blogs/view/JS-%E6%A8%A1%E5%9D%97-CJS-AMD-UMD-ESM-%E7%9A%84%E5%8C%BA%E5%88%AB-d02ef7a0-72b8-11eb-90be-6f112ecd7a48#es-modules-esm
    libraryTarget: 'umd',
    // import largeNumber from 'largeNumber'
    libraryExport: 'default'
  },
  optimization: {
    // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle。
    // https://webpack.docschina.org/configuration/optimization/#optimizationminimize
    minimize: true,
    // 允许你通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
    // https://webpack.docschina.org/configuration/optimization/#optimizationminimizer
    minimizer: [
      // UglifyJS 压缩 ES6 会报错，TerserPlugin 不会，所以推荐 TerserPlugin ✨
      new TerserPlugin({
        // 压缩所有 *.min.js 的文件
        include: /\.min\.js$/,
      })
    ]
  }
}