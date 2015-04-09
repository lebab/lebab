'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _BaseSyntax2 = require('./base.js');

var _BaseSyntax3 = _interopRequireWildcard(_BaseSyntax2);

/**
 * The class to define the ThisExpression syntax
 *
 * @class ThisExpression
 */

var ThisExpression = (function (_BaseSyntax) {

  /**
   * The constructor of ThisExpression
   *
   * @constructor
   */

  function ThisExpression() {
    _classCallCheck(this, ThisExpression);

    _get(Object.getPrototypeOf(ThisExpression.prototype), 'constructor', this).call(this, 'ThisExpression');
  }

  _inherits(ThisExpression, _BaseSyntax);

  return ThisExpression;
})(_BaseSyntax3['default']);

exports['default'] = ThisExpression;
module.exports = exports['default'];