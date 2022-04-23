// 语法转换器
// 1. ES6 => AST
// 2. AST => ES5

const babylon = require('babylon');
const fs = require('fs');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {

  // ES6 => AST
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');
    return babylon.parse(source, {
      // 解析成 模块
      sourceType: 'module'
    });
  },

  // 获取依赖列表
  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      // 分析 import
      ImportDeclaration: ({ node }) => {
        // 依赖全都给老子进来
        dependencies.push(node.source.value);
      }
    });
    return dependencies;
  },

  // AST => ES5
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      // ES6+ 语法都可以解析
      presets: ['env']
    });
    return code;
  }


}