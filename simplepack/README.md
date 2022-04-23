# 自己实现一个简易 webpack

### 功能列表🐂

#### ES6 转 ES5
* ES6 => AST (借助 babylon)
* AST => ES5 (借助 babel-core)

#### 可分析模块依赖
* 通过 babel-traverse 的 ImportDeclaration 方法获取依赖属性

#### 生成的 JS 文件可以在浏览器中运行
🚀🚀🚀


### 项目结构🐘

#### lib
simplepack 源码

#### src
用于测试的普通代码