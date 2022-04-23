// 调试你写的 loader

const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders({
  // 用 css 加载雪碧图
  resource: path.resolve(__dirname, 'loaders/index.css'),
  // 加载 loader
  loaders: [
    path.resolve(__dirname, "./loaders/sprite-loader.js")
  ],
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  console.log('雪碧图 loader 执行结果\n',  err || result);
});
