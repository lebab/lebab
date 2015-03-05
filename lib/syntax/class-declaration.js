"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BaseSyntax = _interopRequire(require("./base.js"));

var ClassBody = _interopRequire(require("./class-body.js"));

var Identifier = _interopRequire(require("./identifier.js"));

/**
 * The class to define the ClassDeclaration syntax
 *
 * @class ClassDeclaration
 */

var ClassDeclaration = (function (BaseSyntax) {

  /**
   * The constructor of ClassDeclaration
   *
   * @constructor
   */

  function ClassDeclaration() {
    _classCallCheck(this, ClassDeclaration);

    _get(Object.getPrototypeOf(ClassDeclaration.prototype), "constructor", this).call(this, "ClassDeclaration");

    this.body = new ClassBody();
    this.superClass = null;
    this.id = new Identifier();
  }

  _inherits(ClassDeclaration, BaseSyntax);

  _prototypeProperties(ClassDeclaration, null, {
    name: {
      set: function (name) {
        this.id.name = name;
      },
      get: function () {
        return this.id.name;
      },
      configurable: true
    }
  });

  return ClassDeclaration;
})(BaseSyntax);

module.exports = ClassDeclaration;