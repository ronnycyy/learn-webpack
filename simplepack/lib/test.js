// 测测你的 语法解析器 🚀

const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');

const ast = getAST(path.resolve(__dirname, '../src/index.js'));
const ds = getDependencies(ast);
console.log(transform(ast));