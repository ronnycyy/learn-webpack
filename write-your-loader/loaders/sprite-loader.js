const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

module.exports = function (source) {
  const callback = this.async();
  // 匹配所有雪碧图 碎片
  // .img1 { background: url(./images/part1.jpeg?_sprite); }
  // \S: 所有非空白符
  // ['url(./images/part1.jpeg?_sprite', 'url(./images/part2.jpeg?_sprite']
  const imgs = source.match(/url\((\S*)\?_sprite/g);
  const mathedImgs = [];

  for (let i = 0, len = imgs.length; i < len; i++) {
    // ./images/part1.jpeg
    const img = imgs[i].match(/url\((\S*)\?_sprite/)[1];
    mathedImgs.push(path.join(__dirname, img));
  }

  Spritesmith.run(
    {
      src: mathedImgs,
    },
    (err, result) => {
      if (!err) {
        // 将雪碧图写入 dist 下
        // 正常开发应该是在 webapck 提供的 emit 里输出
        fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.jpeg'), result.image);
        // 转换 background 属性中的 url
        source = source.replace(/url\((\S*)\?_sprite/g, (match) => {
          return `url("dist/sprite.jpeg")`;
        });
        callback(null, source);
      }
    }
  );
}