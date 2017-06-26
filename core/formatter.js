const Csv = require('./csv')
const getColLabel = require('../misc/utils').getColLabel

module.exports = class Formatter extends Csv {
  constructor(data, options) {
    super(data, options)

    if (!options.rules || typeof options.rules !== 'object') {
      throw new TypeError(`Invalid formating rules, rules should be an object, got ${typeof options.rules}`)
    }

    this.header = Object.keys(this.rules)
    this.csv = this.header.join(',')
  }

  process() {
    for (let row of this.rows) {
      const rowContext = createRowContext(row.split(','))
      let formattedRow = formatRow(this.header, rowContext, this.rules)
      this.csv = this.csv += ('\n' + formattedRow.join(','))
    }
    return this.csv
  }
}

/**
 * Convert row array into object, with column name (A, B ...) as property key.
 * @param {Array} row
 * Output: { A: 165, B: 0 ... }
 */
function createRowContext(row) {
  let labeled = {}
  row.forEach((val, idx) => {
    labeled[getColLabel(idx)] = cleanUpCell(val)
  })

  return labeled
}

function cleanUpCell(cell) {
  if (!cell) { return '' }
  return cell.replace(/\t|\n|\r/g, '')
}

function formatRow(header, context, rules) {
  return header.map(col => {
    const rule = rules[col]
    return formatCell(context, rule)
  })
}

function formatCell(context, rule) {
  if (!rule.expr) { return rule.defaultValue }

  // NOTE: embrace the dark (eval) side :P
  // eslint-disable-next-line
  const evalCellValue = function(expr) { return eval(expr) }.bind(context)
  return evalCellValue(rule.expr) || ''
}
