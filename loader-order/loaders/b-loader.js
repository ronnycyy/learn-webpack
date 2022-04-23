module.exports = function (source) {
  // 如果没有输入任何参数，则Date的构造器会依据系统设置的当前时间来创建一个Date对象。
  console.log('loader b exectuted!', new Date());
  return source;
}
