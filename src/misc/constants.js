// @flow
'use strict'

module.exports.DEFAULT_OPTIONS = {
  separator: ',',
  newLine: {
    default: '\n',
    mac: '\r'
  },
  noHeader: false,
  shiftFirstRow: false,
  rules: {},
  trimTrailing: false,
  dropLastRow: false,
  dropRow: ''
}
