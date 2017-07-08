'use strict';

module.exports.cloneArray = function (arr) {
  return [].concat(arr);
};

/**
 * 26 based conversion helper, which converts index based column names to alphabetical based names.
 * Examples: 1 -> A, 2 -> B, 26 -> Z, 27 -> AA ...
 * @param {number} idx
 */
module.exports.getColLabel = function (idx) {
  var startAt = 64;
  var base = 26;
  var stack = [];
  var col = '';
  while (idx > 0) {
    var rem = Math.floor(idx % base);
    var charCode = null;
    if (rem === 0) {
      charCode = base + startAt;
      idx = Math.floor(idx / base) - 1;
    } else {
      charCode = rem + startAt;
      idx = Math.floor(idx / base);
    }
    stack.push(String.fromCharCode(charCode));
  }
  while (stack.length) {
    col += stack.pop();
  }
  return col;
};