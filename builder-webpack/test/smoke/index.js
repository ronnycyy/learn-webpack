const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const MoCha = require('mocha');

// 10s 超时
const mocha = new MoCha({
  timeout: '10000ms'
});

// 冒烟测试脚本

// cd 到 template
process.chdir(path.join(__dirname, 'template'));

// 每次测试前，先删除 dist
rimraf('./dist', () => {
  // 每次都调一下 builder 的 production 配置，直接放 webpack 里跑一下
  // ⚠️这里必须动态引入了(我踩过坑)，不然路径会错
  webpack(require('../../lib/webpack.prod'), (err, stats) => {

    if (err) {
      console.error(err);
      // 以错误码退出
      process.exit(2);
    }

    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false
    }));

    console.log('Webpack build success, begin run test.');

    // template 构建成功后，开始测试

    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.addFile(path.join(__dirname, 'css-js-test.js'));
    mocha.run();
  });
})

// __dirname === /Users/chenyunyi/Desktop/webpack/learn-webpack/builder-webpack/test/smoke
// path.join 会按平台的分隔符，直接连起来
// path.resolce 是执行 cd