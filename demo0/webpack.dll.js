// 产生 dll.js 库

const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    // React相关的包，分成一个 dll 文件
    library: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: '[name]_[chunkhash].dll.js',
    // 不要放在 dist 里，dist 会被清除!
    path: path.join(__dirname, 'build/library'),
    // 库的名字
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, 'build/library/[name].json'),
    })
  ]
}