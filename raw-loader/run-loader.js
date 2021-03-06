// 调试你写的 loader

const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
  resource: path.resolve(__dirname, 'src/demo.txt'),
  loaders: [
    {
      loader: path.join(__dirname, './src/raw-loader.js'),
      options: {
        id: 111,
        name: 'test',
      }
    }
  ],
  context: {
    minimize: true
  },
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  console.log(err || result);
});
