const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');  // webpack4
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/Search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // js文件指纹 chunkhash  仅生产环境可使用
    filename: '[name]_[chunkhash:8].js',
  },
  mode: 'production',  // 默认开始 UglifyJS 压缩 js 代码
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',   // 解析 ES6
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader', // 3. 将样式通过 style 插入到 html 中   // MiniCssExtractPlugin.loader 和 style-loader 互斥，所以注释
          MiniCssExtractPlugin.loader,   // 3. 将 css 提取成单独的文件
          'css-loader',   // 2. 加载 css 文件，并转成 commonjs 对象 (import './search.css')
          'less-loader',  // 1. 将 less 转化为 css 文件 (import './search.less')  (less less-loader)
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,    // 各种图片资源
        use: [
          {
            loader: 'file-loader',
            options: {
              // 文件指纹
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)/,   // 各种字体
        use: [
          {
            loader: 'file-loader',
            options: {
              // 文件指纹
              name: '[name]_[hash:8][ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // // 把 css 提取成单独的文件
    new MiniCssExtractPlugin({
      // 增加指纹 内容哈希
      filename: '[name]_[contenthash:8].css'
    }),
    // 压缩 css 文件
    new CssMinimizerPlugin(),
    // 一个页面对应一个 HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      // 输出的文件名
      filename: 'index.html',
      // 使用哪些 chunk
      chunks: ['index'],
      // css/js 自动注入
      inject: true,
      // 压缩
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search.html'),
      filename: 'search.html',
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })
  ]
}