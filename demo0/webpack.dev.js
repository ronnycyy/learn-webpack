const path = require('path')
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/Search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: 'development',
  devServer: {
    // 提供一个 http-server 服务
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // 热更新原理 https://www.yuque.com/ronny-91ygq/lw95fd/duqx6g
    hot: true,               // 热更新🔥
  },
  // 轮询判断文件的最后修改时间是否变化
  // 某个文件发生了变化，并不会立即告诉监听者，而是先缓存起来，等 appregateTimeout(合计时间) 到期
  // 等待的时候如果其他文件也变化了，这些变化会统一构建 (batchUpdate)
  // watch: true,
  // watchOptions: {
  //   // 不监听 node_modules
  //   ignored: /node_modules/,
  //   // 监听到变化以后，等 300 ms (合并那些稍微延迟的变化) 再去构建
  //   aggregateTimeout: 300,
  //   // 不停询问系统指定的那些文件有没有变化，每秒问 1000 次
  //   poll: 1000
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',   // 解析 ES6
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', // 3. 将样式通过 style 插入到 html 中
          'css-loader',   // 2. 加载 css 文件，并转成 commonjs 对象 (import './search.css')
          'less-loader',  // 1. 将 less 转化为 css 文件 (import './search.less')  (less less-loader)
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240      // 1024 * 10 Bytes === 10 KB。 如果图片小于 10 KB，打包时采用 base64，无需占用 http 请求。
            }
          }
        ]
      },
      // {
      //   test: /\.(png|jpe?g|gif)$/,    // 各种图片资源
      //   use: 'file-loader'             // 处理文件
      // },
      {
        test: /\.(woff2?|eot|ttf|otf)/,   // 各种字体
        use: 'file-loader',               // 跟处理图片一样的 loader
      }
    ]
  },
  plugins: [
    // webpack-dev-server 配合 HotModuleReplacementPlugin
    // 不输出文件，而是保存在内存中，比起 webpack --watch (磁盘IO) 速度更快
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ]
}