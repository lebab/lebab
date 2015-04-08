"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BaseSyntax = _interopRequire(require("./base.js"));

var esutils = _interopRequire(require("esutils/lib/ast.js"));

/**
 * The class to define the TemplateElement syntax
 *
 * @class TemplateElement
 */

var TemplateElement = (function (BaseSyntax) {

  /**
   * Create a template literal
   *
   * @constructor
   */

  function TemplateElement() {
    _classCallCheck(this, TemplateElement);

    _get(Object.getPrototypeOf(TemplateElement.prototype), "constructor", this).call(this, "TemplateElement");

    this.value = { raw: "", cooked: "" };
    this.tail = false;
  }

  _inherits(TemplateElement, BaseSyntax);

  _prototypeProperties(TemplateElement, null, {
    setValue: {
      value: function setValue(value) {
        this.value.raw = value;
        this.value.cooked = value;
      },
      writable: true,
      configurable: true
    },
    setRaw: {
      value: function setRaw(raw) {
        this.value.raw = raw;
      },
      writable: true,
      configurable: true
    },
    setCooked: {
      value: function setCooked(cooked) {
        this.value.cooked = cooked;
      },
      writable: true,
      configurable: true
    }
  });

  return TemplateElement;
})(BaseSyntax);

module.exports = TemplateElement;