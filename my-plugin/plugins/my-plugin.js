module.exports = class MyPlugin {
  constructor(options) {
    // 用户传给 plugin 的配置
    this.options = options;
  }

  apply(compiler) {
    // 插件必须在 webpack 内部执行
    console.log('MyPlugin Execute!, Option:\n', this.options);
  }
}