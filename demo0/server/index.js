// SSR 问题1: 服务端没有 window/document
if (typeof window === 'undefined') {
  global.window = {};
}

// SSR 问题2: 解析样式

const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server.js');

const renderMarkup = (str) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    </head>
    <body>
      <div>${str}</div>
    </body>
    </html>
  `;
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
