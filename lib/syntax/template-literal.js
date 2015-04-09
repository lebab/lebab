"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BaseSyntax = _interopRequire(require("./base.js"));

var TemplateElement = _interopRequire(require("./template-element.js"));

var esutils = _interopRequire(require("esutils/lib/ast.js"));

var utils = _interopRequire(require("util"));

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

    _get(Object.getPrototypeOf(TemplateLiteral.prototype), "constructor", this).call(this, "TemplateLiteral");

    this.expressions = [];
    this.quasis = [];
  }

  _inherits(TemplateLiteral, _BaseSyntax);

  _createClass(TemplateLiteral, {
    createFromArray: {
      value: function createFromArray(parts) {
        var isString = function (node) {
          return typeof node !== "undefined" && node.type === "Literal" && typeof node.value === "string";
        };

        var isExpression = function (node) {
          return typeof node !== "undefined" && esutils.isExpression(node);
        };

        for (var i = 0; i < parts.length; i++) {
          var curr = parts[i];

          //console.log(curr);

          if (isString(curr)) {
            var element = new TemplateElement();
            curr = curr.value;

            while (isString(parts[++i])) {
              curr += parts[i].value;
            }

            element.setValue(curr);
            this.quasis.push(element);

            i--;
          } else {
            if (i === 0) {
              var element = new TemplateElement();
              element.setValue("");
              this.quasis.push(element);
            }

            if (typeof parts[i + 1] === "undefined") {
              var element = new TemplateElement();
              element.tail = true;
              this.quasis.push(element);
            } else if (parts[i + 1].type !== "Literal") {
              var element = new TemplateElement();
              this.quasis.push(element);
              //console.log(parts[i + 1]);
            }

            this.expressions.push(curr);
          }
        }

        //console.log(JSON.stringify(this));
      }
    }
  });

  return TemplateLiteral;
})(BaseSyntax);

module.exports = TemplateLiteral;