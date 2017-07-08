'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cloneArray = require('../misc/utils').cloneArray;
var DEFAULT_OPTIONS = require('../misc/constants').DEFAULT_OPTIONS;

module.exports = function Csv(data, options) {
  _classCallCheck(this, Csv);

  if (!data || typeof data !== 'string') {
    throw new TypeError('Invalid data source, data should be type string, got ' + (typeof data === 'undefined' ? 'undefined' : _typeof(data)));
  }
  if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
    throw new TypeError('Invalid options, options should be type object, got ' + (typeof options === 'undefined' ? 'undefined' : _typeof(options)));
  }

  options = Object.assign({}, DEFAULT_OPTIONS, options);
  try {
    var props = createProps(data.split(options.newLine), options);
    Object.assign(this, props);
  } catch (err) {
    throw new Error('Failed to parse data due to : ' + err.toString());
  }
};

function createProps(data, options) {
  var props = {};

  if (!options.noHeader) {
    props.header = getHeader(cloneArray(data), options);
    data.shift();
  }
  if (options.shiftFirstRow) {
    data.shift();
  }
  props.rows = getRows(cloneArray(data), options);
  if (options.dropLastRow) {
    props.rows.pop();
  }
  props.csv = props.header ? [props.header.join(options.separator)] : [];
  props.rules = options.rules;

  return props;
}

function getHeader(data, options) {
  var header = data[0].split(options.separator);
  return options.trimTrailing ? trim(cloneArray(header)) : cloneArray(header);
}

function getRows(data, options) {
  var rows = data.filter(function (row) {
    // remove rows with no data
    return !row.split(options.separator).every(function (cell) {
      return !cell;
    });
  });
  return rows.map(function (row) {
    var rowArray = cloneArray(row.split(options.separator));
    rowArray = options.trimTrailing ? trim(rowArray) : rowArray;
    return rowArray.join(',');
  });
}

// remove trailing empty cells
function trim(data) {
  while (!data[data.length - 1]) {
    data.pop();
  }
  return data;
}