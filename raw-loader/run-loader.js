// 调试你写的 loader

const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
  resource: path.resolve(__dirname, 'src/demo.txt'),
  loaders: [
    path.join(__dirname, './src/raw-loader.js')
  ],
  context: {
    minimize: true
  },
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  console.log(err || result);
});
