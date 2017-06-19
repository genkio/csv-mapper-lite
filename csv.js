'use strict'

module.exports = class Csv {
  constructor(data, options) {
    if (!data || typeof data !== 'string') {
      throw new TypeError(`Invalid data source, data should be type string, got ${typeof data}`)
    }
    if (options && typeof options !== 'object') {
      throw new TypeError(`Invalid options, options should be type object, got ${typeof options}`)
    }

    const defaultOptions = {
      separator: ',',
      endOfLineSym: '\n',
      noHeader: false,
      shiftFirstRow: false,
      rules: {}
    }
    options = Object.assign(defaultOptions, options)

    try {
      let dataArray = data.split(options.endOfLineSym)
      if (!options.noHeader) {
        this.header = getHeader(dataArray, options.separator)
      }
      if (options.shiftFirstRow) { dataArray.shift() }
      this.rows = getRows(dataArray, options.separator)
      this.csv = this.header ? [ this.header.join(options.separator) ] : []
      this.rules = options.rules
    } catch (err) {
      throw new Error(`Failed to parse data: ${err.toString()}`)
    }
  }
}

function getHeader(data, sep) {
  let header = data.shift().split(sep)
  return trim(header)
}

function getRows(data, sep) {
  let rows = data.filter(row => {
    // remove rows with no data
    return !row.split(sep).every(cell => !cell)
  })
  return rows.map(row => {
    return trim(row.split(sep)).join(',')
  })
}

// remove trailing empty cells
function trim(data) {
  while (!data[data.length - 1]) {
    data.pop()
  }
  return data
}
