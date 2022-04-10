'use strict';

// SSR 的打包📦配置

const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  // [
  //    '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/index/index.js',
  //    '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/search/index.js'
  // ]
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'));

  for (let i = 0, len = entryFiles.length; i < len; i++) {
    // 
    const pagePath = entryFiles[i];
    // 获取页面名称，如 index, search
    const match = pagePath.match(/src\/(.*)\/index-server\.js/);
    const pageName = match && match[1];

    if (pageName) {
      /**
         entry = {
           search: '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/search/index.js'
         }
      */
      entry[pageName] = pagePath;
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          // 一个 chunk 其实就是一份本地服务器上的 js 文件
          // chunks: [pageName],
          // chunks: ['vendors', pageName],   // 分离基础库 react/react-dom 到 vendors
          chunks: ['commons', pageName],   // 分离公共模块 到 commons
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
          }
        })
      );
    }
  }

  return { entry, htmlWebpackPlugins }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-server.js',
    libraryTarget: 'umd'
  },
  mode: 'production',
  devtool: 'none',
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
        ]
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        }
      ],
    }),
    new FriendlyErrorsWebpackPlugin(),
    function () {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
          console.log('build error');
          process.exit(1);
        }
      })
    },
    ...htmlWebpackPlugins,
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};
