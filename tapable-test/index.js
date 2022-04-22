const {
    SyncHook
} = require('tapable');


const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

// 注册事件
hook.tap('hook1', (arg1, arg2, arg3) => {
    console.log(arg1, arg2, arg3);
});


// 发布事件
hook.call(1089, 2, 3);