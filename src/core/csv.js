// @flow
'use strict'

const cloneArray = require('../misc/utils').cloneArray
const DEFAULT_OPTIONS = require('../misc/constants').DEFAULT_OPTIONS

module.exports = class Csv {
  constructor(data: string, options: Object) {
    if (!data || typeof data !== 'string') {
      throw new TypeError(`Invalid data source, data should be type string, got ${typeof data}`)
    }
    if (options && typeof options !== 'object') {
      throw new TypeError(`Invalid options, options should be type object, got ${typeof options}`)
    }

    options = Object.assign({}, DEFAULT_OPTIONS, options)
    try {
      const props = createProps(data, options)
      Object.assign(this, props)
    } catch (err) {
      throw new Error(`Failed to parse data due to : ${err.toString()}`)
    }
  }
}

function createProps(data: string, options: Object): Object {
  let props = { }

  const isDifferentNewLineSym = !data.match(new RegExp(options.newLine.default))
  if (isDifferentNewLineSym) {
    data = data.replace(new RegExp(options.newLine.mac, 'g'), options.newLine.default)
  }
  const arr = data.split(options.newLine.default)

  if (!options.noHeader) {
    props.header = getHeader(cloneArray(arr), options)
    arr.shift()
  }
  if (options.shiftFirstRow) { arr.shift() }
  props.rows = getRows(cloneArray(arr), options)
  if (options.dropLastRow) { props.rows.pop() }
  props.csv = props.header ? [ props.header.join(options.separator) ] : []
  props.rules = options.rules

  return props
}

function getHeader(data: Array<string>, options: Object): Array<string> {
  let header = data[0].split(options.separator)
  return options.trimTrailing
    ? trim(cloneArray(header))
    : cloneArray(header)
}

function getRows(data: Array<string>, options: Object): Array<string> {
  let rows = data.filter(row => {
    // remove rows with no data
    return !row.split(options.separator).every(cell => !cell)
  })
  return rows.map(row => {
    let rowArray = cloneArray(row.split(options.separator))
    rowArray = options.trimTrailing ? trim(rowArray) : rowArray
    return rowArray.join(',')
  })
}

// remove trailing empty cells
function trim(data: Array<string>): Array<string> {
  while (!data[data.length - 1]) {
    data.pop()
  }
  return data
}
