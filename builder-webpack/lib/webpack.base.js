const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * 1. 资源解析🔍
 * 2. 样式增强💪
 * 3. 目录清理🧹
 * 4. 多页面打包📦
 * 5. 命令行优化、错误捕获💻
 * 6. CSS 提取🧯
 */


// 方便冒烟测试而写了一个当前执行路径，这个路径就是要测试的 template
const projectRoot = process.cwd();

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

  for (let i = 0, len = entryFiles.length; i < len; i++) {
    // '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/index/index.js'
    const pagePath = entryFiles[i];
    // 获取页面名称，如 index, search
    const match = pagePath.match(/\/src\/(.*)\/index.js/);
    const pageName = match && match[1];

    /**
     * entry = {
        index: '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/index/index.js',
        search: '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/search/index.js'
      }
     */
    entry[pageName] = pagePath;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        // 一个 chunk 其实就是一份本地服务器上的 js 文件
        // chunks: [pageName],
        // chunks: ['vendors', pageName],   // 分离基础库 react/react-dom 到 vendors
        chunks: ['commons', pageName], // 分离公共模块 到 commons
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        }
      })
    )
  }

  return { entry, htmlWebpackPlugins };
};
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          // 支持 ES6 语法
          'babel-loader',
          // JS 语法规范检查
          // 'eslint-loader'  // 有点烦，先注释掉你
        ],
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    ...htmlWebpackPlugins,
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        // webpack done 事件
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('出错啦!! 🤦‍♂️: 日志📒上报🚀🚀🚀');
          process.exit(1);
        }
      });
    },
  ],
};
