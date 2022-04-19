export function funcA() {
  return '没被 Tree-Shaking 掉的 func A';
}

// production 下，默认开启 Tree-Shaking
// 没有用到的函数，会被摇掉
export function notUseFuncB() {
  return 'func b';
}