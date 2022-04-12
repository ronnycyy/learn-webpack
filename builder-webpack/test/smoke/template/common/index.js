// 使用 optimization.splitChunks, 把公共模块打成一个 common.js 的 chunk，在本地服务器而非CDN服务器上。
export function common() {
  return 'common module';
}
