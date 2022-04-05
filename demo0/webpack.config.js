const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/Search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',   // 解析 ES6
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // 将样式通过 style 插入到 html 中
          'css-loader',   // 加载 css 文件，并转成 commonjs 对象
        ]
      }
    ]
  }
}