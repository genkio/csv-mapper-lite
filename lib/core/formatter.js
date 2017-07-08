'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Csv = require('./csv');
var getColLabel = require('../misc/utils').getColLabel;

module.exports = function (_Csv) {
  _inherits(Formatter, _Csv);

  function Formatter(data, options) {
    _classCallCheck(this, Formatter);

    var _this = _possibleConstructorReturn(this, (Formatter.__proto__ || Object.getPrototypeOf(Formatter)).call(this, data, options));

    if (!options.rules || _typeof(options.rules) !== 'object') {
      throw new TypeError('Invalid formating rules, rules should be an object, got ' + _typeof(options.rules));
    }

    _this.header = Object.keys(_this.rules);
    _this.csv = _this.header.join(',');
    return _this;
  }

  _createClass(Formatter, [{
    key: 'process',
    value: function process() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var row = _step.value;

          var rowContext = createRowContext(row.split(','));
          var formattedRow = formatRow(this.header, rowContext, this.rules);
          this.csv = this.csv += '\n' + formattedRow.join(',');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this.csv;
    }
  }]);

  return Formatter;
}(Csv);

/**
 * Convert row array into object, with column name (A, B ...) as property key.
 * @param {Array} row
 * Output: { A: 165, B: 0 ... }
 */
function createRowContext(row) {
  var labeled = {};
  row.forEach(function (val, idx) {
    labeled[getColLabel(idx + 1)] = cleanUpCell(val);
  });

  return labeled;
}

function cleanUpCell(cell) {
  if (!cell) {
    return '';
  }
  return cell.replace(/\t|\n|\r/g, '');
}

function formatRow(header, context, rules) {
  return header.map(function (col) {
    var rule = rules[col];
    return formatCell(context, rule);
  });
}

function formatCell(context, rule) {
  if (!rule.expr) {
    return rule.defaultValue;
  }

  // NOTE: embrace the dark (eval) side :P
  // The reason I'm using eval here is that, together with closure,
  // this is probably the most 'elegant' (less code) implementation I can come up with.
  // Happy coding :)

  // eslint-disable-next-line
  var evalCellValue = function (expr) {
    return eval(expr);
  }.bind(context);
  try {
    return evalCellValue(rule.expr) || '';
  } catch (err) {
    throw new Error('Failed to format data due to: ' + err.message);
  }
}