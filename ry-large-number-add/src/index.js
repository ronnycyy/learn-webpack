/**
 * 大整数加法
 * @param {string} a 
 * @param {string} b 
 */
export default function (a, b) {

  let i = a.length - 1;
  let j = b.length - 1;

  // 进位
  let carry = 0;
  // 结果
  let ret = '';

  while (i >= 0 || j >= 0) {
    // 从个位开始，按位加起来
    let x = 0;
    let y = 0;
    let sum;

    if (i >= 0) {
      x = a[i] - '0';
      i--;
    }

    if (j >= 0) {
      y = b[j] - '0';
      j--;
    }

    sum = x + y + carry;

    if (sum >= 10) {
      sum -= 10;
      carry = 1;
    }
    else {
      carry = 0;
    }

    ret = sum + ret;
  }

  // a,b 两个数，所有位，都加进 ret 了

  // 最后的进位
  if (carry) {
    ret = carry + ret;
  }

  return ret;

  // (大整数乘法是类似的思路)
}