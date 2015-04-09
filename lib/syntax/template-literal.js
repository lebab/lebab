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

var _TemplateElement = require('./template-element.js');

var _TemplateElement2 = _interopRequireWildcard(_TemplateElement);

var _esutils = require('esutils/lib/ast.js');

var _esutils2 = _interopRequireWildcard(_esutils);

var _utils = require('util');

var _utils2 = _interopRequireWildcard(_utils);

/**
 * The class to define the TemplateLiteral syntax
 *
 * @class TemplateLiteral
 */

var TemplateLiteral = (function (_BaseSyntax) {

  /**
   * Create a template literal
   *
   * @constructor
   */

  function TemplateLiteral() {
    _classCallCheck(this, TemplateLiteral);

    _get(Object.getPrototypeOf(TemplateLiteral.prototype), 'constructor', this).call(this, 'TemplateLiteral');

    this.expressions = [];
    this.quasis = [];
  }

  _inherits(TemplateLiteral, _BaseSyntax);

  _createClass(TemplateLiteral, [{
    key: 'createFromArray',
    value: function createFromArray(parts) {
      var isString = function isString(node) {
        return typeof node !== 'undefined' && node.type === 'Literal' && typeof node.value === 'string';
      };

      var isExpression = function isExpression(node) {
        return typeof node !== 'undefined' && _esutils2['default'].isExpression(node);
      };

      for (var i = 0; i < parts.length; i++) {
        var curr = parts[i];

        //console.log(curr);

        if (isString(curr)) {
          var element = new _TemplateElement2['default']();
          curr = curr.value;

          while (isString(parts[++i])) {
            curr += parts[i].value;
          }

          element.setValue(curr);
          this.quasis.push(element);

          i--;
        } else {
          if (i === 0) {
            var element = new _TemplateElement2['default']();
            element.setValue('');
            this.quasis.push(element);
          }

          if (typeof parts[i + 1] === 'undefined') {
            var element = new _TemplateElement2['default']();
            element.tail = true;
            this.quasis.push(element);
          } else if (parts[i + 1].type !== 'Literal') {
            var element = new _TemplateElement2['default']();
            this.quasis.push(element);
            //console.log(parts[i + 1]);
          }

          this.expressions.push(curr);
        }
      }

      //console.log(JSON.stringify(this));
    }
  }]);

  return TemplateLiteral;
})(_BaseSyntax3['default']);

exports['default'] = TemplateLiteral;
module.exports = exports['default'];