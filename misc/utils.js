'use strict'

module.exports.cloneArray = arr => {
  return [].concat(arr)
}

module.exports.getColLabel = idx => {
  const startAt = 64
  const base = 26
  let stack = []
  let col = ''
  while (idx > 0) {
    const rem = Math.floor(idx % base)
    let charCode = null
    if (rem === 0) {
      charCode = base + startAt
      idx = Math.floor(idx / base) - 1
    } else {
      charCode = rem + startAt
      idx = Math.floor(idx / base)
    }
    stack.push(String.fromCharCode(charCode))
  }
  while (stack.length) {
    col += stack.pop()
  }
  return col
}
