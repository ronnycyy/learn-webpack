const assert = require('assert');

// mocha + chai 单元测试

// instanbul 测试覆盖率
// 覆盖了多少 行/函数/语句/分支

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base.js');

  it('entry', () => {
    assert.strictEqual(baseConfig.entry.index, '/Users/chenyunyi/Desktop/webpack/learn-webpack/builder-webpack/test/smoke/template/src/index/index.js');
    assert.strictEqual(baseConfig.entry.search, '/Users/chenyunyi/Desktop/webpack/learn-webpack/builder-webpack/test/smoke/template/src/search/index.js');
  })
})