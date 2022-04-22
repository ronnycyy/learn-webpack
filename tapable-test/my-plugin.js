// 模拟一个插件

const Compiler = require('./Compiler');

// 插件定义
class MyPlugin {
    constructor() {

    }
    // 必须有 apply 方法
    apply(compiler) {
        // 订阅 compiler 的三个 hook，都注册了回调
        compiler.hooks.brake.tap("WarningLampPlugin", () => console.log('WarningLampPlugin'));
        compiler.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
        compiler.hooks.calculateRoutes.tapPromise("calculateRoutes tapAsync", (source, target, routesList) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`tapPromise to ${source} ${target} ${routesList}`)
                    resolve();
                }, 1000)
            });
        });
    }
}


// 执行插件   webpack --config webpack.config.js
const myPlugin = new MyPlugin();

const options = {
    plugins: [myPlugin]
}

const compiler = new Compiler();

for (const plugin of options.plugins) {
    if (typeof plugin === "function") {
        // compiler当成 this，也当成传参
        // 肯定也是订阅事件，注册回调
        plugin.call(compiler, compiler);
    }
    else {
        // 执行插件对象的 apply 方法
        // 订阅事件，注册回调
        plugin.apply(compiler);
    }
}

// 注册好了，可以发布了
// 发布事件
compiler.run();
