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

var _FunctionExpression = require('./function-expression.js');

var _FunctionExpression2 = _interopRequireWildcard(_FunctionExpression);

var _Identifier = require('./identifier.js');

var _Identifier2 = _interopRequireWildcard(_Identifier);

var _BlockStatement = require('./block-statement.js');

var _BlockStatement2 = _interopRequireWildcard(_BlockStatement);

/**
 * The class to define the MethodDefinition syntax
 *
 * @class MethodDefinition
 */

var MethodDefinition = (function (_BaseSyntax) {

  /**
   * Create a method for a class
   *
   * @constructor
   * @param {ClassDeclaration} _class
   */

  function MethodDefinition(_class) {
    _classCallCheck(this, MethodDefinition);

    _get(Object.getPrototypeOf(MethodDefinition.prototype), 'constructor', this).call(this, 'MethodDefinition');

    this.key = new _Identifier2['default']();
    this['class'] = _class;
    this['static'] = false;
    this.computed = false;
    this.kind = '';
    this.value = new _FunctionExpression2['default']();
  }

  _inherits(MethodDefinition, _BaseSyntax);

  _createClass(MethodDefinition, [{
    key: 'name',
    set: function (name) {
      this.key.name = name;
    },
    get: function () {
      return this.key.name;
    }
  }, {
    key: 'body',
    set: function (body) {
      if (_BlockStatement2['default'].is(body)) {
        this.value.body = body;
      } else if (body instanceof Array) {
        this.value.body.body = body;
      } else {
        this.value.body.body = [body];
      }
    },
    get: function () {
      return this.value.body;
    }
  }, {
    key: 'params',
    set: function (params) {
      this.value.params = params;
    },
    get: function () {
      return this.value.params;
    }
  }]);

  return MethodDefinition;
})(_BaseSyntax3['default']);

exports['default'] = MethodDefinition;
module.exports = exports['default'];