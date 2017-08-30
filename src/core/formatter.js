// @flow
'use strict'

const Csv = require('./csv')
const getColLabel = require('../misc/utils').getColLabel

module.exports = class Formatter extends Csv {
  options: Object
  rules: Object
  header: Array<string>
  rows: Array<string>
  csv: string

  constructor(data: string, options: Object) {
    super(data, options)

    if (!options.rules || typeof options.rules !== 'object') {
      throw new TypeError(`Invalid formating rules, rules should be an object, got ${typeof options.rules}`)
    }

    this.header = Object.keys(this.rules)
    this.csv = this.header.join(',')
  }

  process(): string {
    for (let row of this.rows) {
      const rowContext = createRowContext(row.split(','))
      if (dropRow(rowContext, this.options.dropRow)) { continue }
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
function createRowContext(row: Array<string>): Object {
  let labeled = {}
  row.forEach((val, idx) => {
    labeled[getColLabel(idx + 1)] = cleanUpCell(val)
  })

  return labeled
}

function cleanUpCell(cell: string): string {
  if (!cell) { return '' }
  return cell.replace(/\t|\n|\r/g, '')
}

function formatRow(header: Array<string>, context: Object, rules: Object): Array<string> {
  return header.map(col => {
    const rule = rules[col]
    return formatCell(context, rule)
  })
}

function formatCell(context: Object, rule: Object): string {
  if (!rule.expr) { return rule.defaultValue }

  const evalCellValue = getEvalFuncWithContext(context)
  try {
    return evalCellValue(rule.expr) || ''
  } catch (err) {
    throw new Error(`Failed to format data due to: ${err.message}`)
  }
}

function dropRow(context: Object, condition: string): boolean {
  if (!condition) { return false }

  const evalDropRule = getEvalFuncWithContext(context)
  try {
    return evalDropRule(condition)
  } catch (err) {
    throw new Error(`Failed to evaluate drop row rule due to: ${err.message}`)
  }
}

function getEvalFuncWithContext(context: Object): Function {
  // NOTE: embrace the dark (eval) side :P
  // The reason I'm using eval here is that, together with closure,
  // this is probably the most 'elegant' (less code) implementation I can come up with.
  // Happy coding :)
  return function(expr) {
    // eslint-disable-next-line
    return eval(expr)
  }.bind(context)
}
