module.exports = {
  // ESLint 解析器
  "parser": "babel-eslint",
  // 配置继承自 eslint-config-airbnb
  "extends": "airbnb",
  // 启用 browser 和 Node.js 的环境
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    // 2个空格缩进
    "indent": ["error", 2]
  }
};