const path = require('path');
const ZipPlugin = require('./plugins/zip-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new ZipPlugin({
      filename: 'offline'
    })
  ]
}