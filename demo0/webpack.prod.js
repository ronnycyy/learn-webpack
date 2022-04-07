const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');  // webpack4
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/Search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // js文件指纹 chunkhash  
    // 仅生产环境可使用
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
          {
            loader: 'postcss-loader',  // 0. 和 less-loader 预处理 不同， autoprefixer 是后置处理（样式打包完了再处理）
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // 增加 css3 前缀，兼容各大浏览器
                    // display: flex => display:-webkit-flex; display:-ms-flexbox; ...
                    "autoprefixer",  // 坑!! 一点注释都不能有啊在less里......
                    {
                      // 兼容到最新的2个版本； 版本使用人数所占比例; 兼容 ios 7+
                      overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                    },
                  ],
                ],
              }
            }
          },
          // rem: (css3 单位) font-size of the root element，这是一个相对单位，在不同的机型下，1 rem占用的 px 数是不一样的。
          // 比如 1rem 在 iphone6 (375px宽) 下是 A px，那么在 750px 宽的设备中，就是 2A px。
          // 例子: 移动端 css 的 px 自动转换成 rem
          // lib-flexible 动态计算 1 rem 的 px 值
          {
            loader: 'px2rem-loader',
            options: {
              // 初始换算 1 rem === 37.5px  (针对你当前调试的设备来设定，就是一个比例)
              // 例子:
              // 1. 开发过程写了 20px，打包成 0.53333333 rem
              // 2. 那么到了 iphone6S 上，通过 lib-flexible 库动态设置 html 的 font-size 为 41.4 px，
              // 3. 这时候 0.53333333 rem * 41.4 px = 22.08 px (做到了 "屏幕变大，我的px也变大" )

              // 可以总结为，设备屏幕变小的过程，就是 1rem 从 75px 到 37.5px 的过程

              remUnit: 37.5,    // 可以固定成这个，这个是 iphone6 的 1rem 尺寸。开发时打开 iphone6 模拟视图看效果，写 px 即可。
              remPrecision: 8   // px 转 rem 后，小数点的位数
            }
          }
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
    }),
    new CleanWebpackPlugin(),
  ]
}