'use strict'

module.exports.cloneArray = arr => {
  return [].concat(arr)
}

module.exports.getColLabel = idx => {
  const startAt = 65
  return String.fromCharCode(idx + startAt)
}
