"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BaseSyntax = _interopRequire(require("./base.js"));

var FunctionExpression = _interopRequire(require("./function-expression.js"));

var Identifier = _interopRequire(require("./identifier.js"));

/**
 * The class to define the MethodDefinition syntax
 *
 * @class MethodDefinition
 */

var MethodDefinition = (function (BaseSyntax) {

  /**
   * Create a method for a class
   *
   * @constructor
   * @param {ClassDeclaration} _class
   */

  function MethodDefinition(_class) {
    _classCallCheck(this, MethodDefinition);

    _get(Object.getPrototypeOf(MethodDefinition.prototype), "constructor", this).call(this, "MethodDefinition");

    this.key = new Identifier();
    this["class"] = _class;
    this["static"] = false;
    this.computed = false;
    this.kind = "";
    this.value = new FunctionExpression();
  }

  _inherits(MethodDefinition, BaseSyntax);

  _prototypeProperties(MethodDefinition, null, {
    name: {
      set: function (name) {
        this.key.name = name;
      },
      get: function () {
        return this.key.name;
      },
      configurable: true
    },
    body: {
      set: function (body) {
        this.value.body = body;
      },
      get: function () {
        return this.value.body;
      },
      configurable: true
    },
    params: {
      set: function (params) {
        this.value.params = params;
      },
      get: function () {
        return this.value.params;
      },
      configurable: true
    }
  });

  return MethodDefinition;
})(BaseSyntax);

module.exports = MethodDefinition;