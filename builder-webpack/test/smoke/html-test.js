const glob = require('glob-all');

// moCha 测试用例:  应该生成 2 份 html 文件

describe('Checking generated html files', () => {
  it('should generate html files', (done) => {

    // 此时 work directory 在 template
    const files = glob.sync([
      './dist/index.html',
      './dist/search.html'
    ]);

    if (files.length > 0) {
      done();  // 执行 done 代表测试用例跑通
    } else {
      throw new Error('no html files generated');
    }
  });
});