'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _BaseSyntax2 = require('./base.js');

var _BaseSyntax3 = _interopRequireWildcard(_BaseSyntax2);

var _BlockStatement = require('./block-statement.js');

var _BlockStatement2 = _interopRequireWildcard(_BlockStatement);

/**
 * The class to define the FunctionExpression syntax
 *
 * @class FunctionExpression
 */

var FunctionExpression = (function (_BaseSyntax) {

  /**
   * The constructor of FunctionExpression
   *
   * @constructor
   */

  function FunctionExpression() {
    _classCallCheck(this, FunctionExpression);

    _get(Object.getPrototypeOf(FunctionExpression.prototype), 'constructor', this).call(this, 'FunctionExpression');

    this.body = new _BlockStatement2['default']();
    this.params = [];
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.id = null;
  }

  _inherits(FunctionExpression, _BaseSyntax);

  _createClass(FunctionExpression, [{
    key: 'appendToBody',
    value: function appendToBody(statement) {
      this.body.appendToBody(statement);
    }
  }]);

  return FunctionExpression;
})(_BaseSyntax3['default']);

exports['default'] = FunctionExpression;
module.exports = exports['default'];