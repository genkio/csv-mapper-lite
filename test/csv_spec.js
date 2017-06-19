'use strict'

const test = require('ava')
const Csv = require('../csv')
const mockCsvData = 'col1,,col2,col3,,\n,1,2,3,,,\n'
const mockCsvDataWithoutHeader = '1,2,3\n'
const mockCsvDataWithEmptyRows = 'col1,col2,col3,\n,,\n1,,2,3\n,,\n,,\n,,'

test('it should throw error if there is no data passed in', t => {
  t.throws(() => {
    const csv = new Csv('')
  })
})

test('it should throw error if data passed in is not string type', t => {
  t.throws(() => {
    const csv = new Csv({})
  })
})

test('it should split data into header and rows', t => {
  const csv = new Csv(mockCsvData)
  t.truthy(csv.header)
  t.truthy(csv.rows)
})

test('it should have no header if noHeader option is set to true', t => {
  const csv = new Csv(mockCsvDataWithoutHeader, { noHeader: true })
  t.falsy(csv.header)
})

test('it should remove first row if shiftFirstRow option is et to true', t => {
  const csv = new Csv(mockCsvData, { shiftFirstRow: true })
  t.is(csv.rows.length, 0)
})

test('it should drop empty rows with no data', t => {
  const csv = new Csv(mockCsvDataWithEmptyRows)
  t.is(csv.rows.length, 1)
})

test('it should drop trailing empty cells in header', t => {
  const csv = new Csv(mockCsvData)
  t.is(csv.header.length, 4)
})

test('it should drop trailing empty cells in rows', t => {
  const csv = new Csv(mockCsvData)
  t.is(csv.rows[0], ',1,2,3')
})
