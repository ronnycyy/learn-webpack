const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // 先执行 b，再执行 a
        use: [
          path.resolve('./loaders/a-loader.js'),
          path.resolve('./loaders/b-loader.js'),
        ]
      }
    ]
  }
}