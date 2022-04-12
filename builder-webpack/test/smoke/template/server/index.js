// SSR 问题1: 服务端没有 window/document
if (typeof window === 'undefined') {
  global.window = {};
}

// SSR 问题2: 解析样式
// 解决方案: 首屏不渲染，再发一次吧: SSR 只在 index.html 的 占位符(HTML_PLACEHOLDER) 插入 React 模版，其余的 css 等，由浏览器再发一些请求去获取。

// SSR 问题3: 初始的 ajax 数据
// 解决方案: 先请求(这里是mock)一次，再通过 占位符(INITIAL_DATA_PLACEHOLDER) 插入。

const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server.js');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('./data.json');

const renderMarkup = (str) => {
  // 打包📦之后的 html 留个占位符，供这里插入
  const dataString = JSON.stringify(data);
  return template
    .replace('<!--HTML_PLACEHOLDER-->', str)     // React 渲染的 html 字符串
    .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__init_data__=${dataString}</script>`);   // 模拟首屏 ajax 数据
}

const server = (port) => {
  const app = express();

  // 提供 dist 下的所有资源
  app.use(express.static('dist'));

  // 搞一个 搜索页
  app.get('/search', (req, res) => {
    // 服务端渲染 
    res.status(200).send(renderMarkup(renderToString(SSR)));
  });

  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

server(process.env.PORT || 3000);
