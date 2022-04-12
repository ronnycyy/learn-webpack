const merge = require('webpack-merge');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssProcessor = require('cssnano');
const baseConfig = require('./webpack.base');

/**
 * 1. 代码压缩🔨
 * 2. 文件指纹🔒
 * 3. Tree Shaking🌲🌲🌲 (内置在 production)
 * 4. Scope Hoisting (内置在 production)
 * 5. 页面速度🚗优化 (基础包CDN)
 * 6. 体积优化 (代码分割)
*/

const prodConfig = {
  mode: 'production',
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor,
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          // 注意浏览器不认识 cjs 的包，要用 umd/amd
          entry: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
};

module.exports = merge(baseConfig, prodConfig);
