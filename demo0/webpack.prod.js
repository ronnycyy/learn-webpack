'use strict';

const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 一个很旧的包 happypack(不推荐) 实践多进程打包📦
// 推荐 thread-loader
const HappyPack = require('happypack');

// 多进程并行压缩 js 代码
const TerserPlugin = require("terser-webpack-plugin");

// 启用缓存 提升二次构建速度
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// 速度分析
// 测量各 loader/plugin 的时间消耗，以优化某些环节，提升打包📦速度
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

// 体积分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


// tree-shaking css
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}

// import 会被转换为 __webpack_require__

// 通用多页面打包方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

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

  return { entry, htmlWebpackPlugins }
}

const { entry, htmlWebpackPlugins } = setMPA();


// smp.wrap 测量打包各环节的速度
module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  // 默认开启 Tree-Shaking
  // 默认开始 scope hoisting
  // 所谓的 0配置...
  mode: 'production',

  // 不要默认压缩，用 source map 来细化压缩
  // 不要 scope hoisting
  // mode: 'none',

  // https://webpack.docschina.org/configuration/devtool/#development
  // https://webpack.docschina.org/configuration/devtool/#production

  // devtool 一  开发环境
  // eval 不会映射错误行列信息，它快，适合开发环境
  // devtool: 'eval',
  // devtool: 'eval-source-map',
  // devtool: 'eval-cheap-source-map'

  // devtool 二 生产环境
  // source-map 最慢，但是发生错误时，能映射到行列信息。
  // ⚠️⚠️⚠️不能把 .map 暴露在生产环境!!!! 应该☝️把 .js 单独上线， map 留在监控系统
  // 实测 *.js是822KB，*.js.map是1.62MB, sourceMappingURL 指向 *.js.map 文件
  // devtool: 'source-map',
  devtool: 'none',  // 官网说，这是一个不错的选择✌️

  // devtool 三 特定场景
  // map 内联到 js 里，js 变得很大，实测*.js是2.96MB
  // devtool: 'inline-source-map',

  // 分离基础包 方式一  ————  到本地服务器 (vendors.js)
  // 使用 splitChunks 分离基础包 react/react-dom
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     cacheGroups: {
  //       commons: {
  //         test: /(react|react-dom)/,
  //         name: 'vendors',   // angular 里也打成了 vendors.js，貌似就是这个
  //         chunks: 'all',
  //       }
  //     }
  //   },
  // },


  // 优化输出日志
  // stats: 'errors-only',

  optimization: {
    // 分离页面公共文件
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    },

    // TerserPlugin 多进程并行压缩代码
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,  // 开启缓存，提升二次构建速度 (实测提速⚡️明显)
      }),
    ]
  },

  // 缩小构建目标
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
    },
    extensions: ['.js'],
    mainFields: ['main']
  },

  module: {
    rules: [
      {
        test: /.js$/,
        // 缩小构建目标 - 仅构建 src 里的 js，不构建 node_module 里的 js。
        include: path.resolve('src'),
        use: [

          // 使用 webpack4 默认的 thread-loader 多进程打包📦
          // {
          //   loader: 'thread-loader',
          //   options: {
          //     workers: 3,   // 起 3 个进程
          //   },
          // },
          // 支持 ES6 语法
          // 'babel-loader',

          // HappyPack 多进程打包📦
          'happypack/loader',

          // JS 语法规范检查
          // 'eslint-loader'  // 有点烦，先注释掉你
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
    // 提取 css 成单独的文件，再加上指纹🔒
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    // 压缩 css
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new CleanWebpackPlugin(),
    // 分离基础包 方式二  ————  到 CDN 服务器
    // 由于减少了 react/react-dom，组件.js 明显减小了
    // 注释掉，看 BundleAnalyzerPlugin 分析出的体积有啥变化
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       // 注意浏览器不认识 cjs 的包，要用 umd/amd
    //       entry: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
    //       global: 'ReactDOM',
    //     }
    //   ],
    // }),
    ...htmlWebpackPlugins,
    // 优化输出日志
    // 注释掉，方便使用 npm run build:stats 查看分析数据
    new FriendlyErrorsWebpackPlugin(),
    // 捕获到错误时，自定义处理逻辑
    function () {
      this.hooks.done.tap('done', (stats) => {
        // webpack done 事件
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
          console.log('出错啦!! 🤦‍♂️: 日志📒上报🚀🚀🚀');
          process.exit(1);
        }
      })
    },
    // new BundleAnalyzerPlugin(),
    // 以往 webpack 打出来的一个模块就是一个闭包，在浏览器里，执行速度很慢
    // 开启 Scope Hoisting, 把模块内联进来，减少闭包
    // new webpack.optimize.ModuleConcatenationPlugin()

    // HappyPack 多进程打包📦
    new HappyPack({
      // https://www.npmjs.com/package/happypack#how-it-works
      // 把你在 loader 移除的包加回来
      // cacheDirectory=true 开启缓存，提升二次构建速度
      // 首次编译后，生成 node_modules/.cache/babel-loader
      loaders: ['babel-loader?cacheDirectory=true']
    }),

    // 引用 dll 库
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json')
    }),

    // wtf!!! 二次构建的提速⚡️巨大！！！
    new HardSourceWebpackPlugin(),

    // 摇掉没有用到的 css 样式
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ]
};
