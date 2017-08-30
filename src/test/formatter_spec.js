'use strict'

const test = require('ava')
const Formatter = require('../core/formatter')
const mockOptions = {
  rules: {
    newCol1: { expr: 'this.B', defaultValue: '0' },
    newCol2: { expr: 'this.A', defaultValue: '0' },
    newCol3: { expr: 'this.B+this.A', defaultValue: '0' }
  }
}
const mockRawData = 'col1,col2,col3,,\nworld,hello,,,,\n'
const formattedHeader = 'newCol1,newCol2,newCol3'
const formattedData = 'newCol1,newCol2,newCol3\nhello,world,helloworld'

test('it should throw error if there is no rules object passed in', t => {
  t.throws(() => {
    // eslint-disable-next-line
    const formatter = new Formatter(mockRawData, { rules: '' })
  })
})

test('it should format data base on the rule', t => {
  const formatter = new Formatter(mockRawData, mockOptions)
  t.deepEqual(formatter.process(), formattedData)
})

test('it should drop certain row when dropRow rule condition was met', t => {
  const formatter = new Formatter(mockRawData, Object.assign(mockOptions, { dropRow: 'this.B === "hello"' }))
  t.deepEqual(formatter.process(), formattedHeader)
})
