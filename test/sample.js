
const assert = require('assert');


function add(a, b) {
  return a + b;
}



// 測試 add 函式
describe('add', function () {
  it('adds 1 + 2 to equal 3', function () {
    assert.strictEqual(add(1, 2), 3);
  });

  it('adds -1 + 5 to equal 4', function () {
    assert.strictEqual(add(-1, 5), 4);
  });

  it('adds "hello" + "world" to equal "helloworld"', function () {
    assert.strictEqual(add("hello", "world"), "helloworld");
  });
});