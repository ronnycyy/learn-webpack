// simplepack 的入口文件

// 用户是上帝，先把用户的配置接过来❤️
const options = require('../simplepack.confg');
// 准备编译器
const Compiler = require('./compiler');

new Compiler(options).run();