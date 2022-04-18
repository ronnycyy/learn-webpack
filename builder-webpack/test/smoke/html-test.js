const glob = require('glob-all');

// moCha 测试用例:  应该生成 2 份 html 文件

// 一个 descirbe 对应一个文件
describe('Checking generated html files', () => {
  // 一个 it 是一个测试用例
  it('should generate html files', (done) => {
    // 此时 work directory 在 template
    const files = glob.sync([
      './dist/index.html',
      './dist/search.html'
    ]);

    // 一个 expect 是一个断言

    if (files.length > 0) {
      done();  // 执行 done 代表测试用例跑通
    } else {
      throw new Error('no html files generated');
    }
  });
});