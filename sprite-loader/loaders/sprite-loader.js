const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

// 这里 loader 处理的是 index.css，所以 source 是 样式的内容
module.exports = function (source) {
  // 合图是一个异步的过程
  const callback = this.async();

  // 匹配所有 url*****?_sprite 的图片路径
  const imgs = source.match(/url\((\S*)\?_sprite/g);
  const matchedImgs = [];

  // 提取 雪碧小图 的 filepath
  for (let i = 0; i < imgs.length; i++) {
    // \S*: 除了空格之外的所有，可以零个或多个
    // ./images/lion.jpg
    const img = imgs[i].match(/url\([\'\"](\S*)\?_sprite/)[1];
    matchedImgs.push(path.join(__dirname, img));
  }

  Spritesmith.run({
    src: matchedImgs
  }, (err, result) => {
    fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.jpg'), result.image);

    // index.css 的 background: url(..) 要改成 雪碧图的 url
    source = source.replace(/url\((\S*)\?_sprite/g, (match) => {
      return `url('dist/sprite.jpg`;
    });

    fs.writeFileSync(path.join(process.cwd(), 'dist/index.css'), source);
    
    callback(null, source);
  });
}
