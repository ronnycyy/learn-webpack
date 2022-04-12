module.exports = {
  // ESLint 解析器
  "parser": "babel-eslint",
  // 配置继承自 eslint-config-airbnb-base
  "extends": "airbnb-base",
  // 启用 browser 和 Node.js 的环境
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "no-plusplus": 0,
    "no-console": 0,
    "global-require": 0
  }
};