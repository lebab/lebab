"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BaseSyntax = _interopRequire(require("./base.js"));

/**
 * The class to define the BlockStatement syntax
 *
 * @class BlockStatement
 */

var BlockStatement = (function (BaseSyntax) {

  /**
   * The constructor of BlockStatement
   *
   * @constructor
   */

  function BlockStatement(callee, args) {
    _classCallCheck(this, BlockStatement);

    _get(Object.getPrototypeOf(BlockStatement.prototype), "constructor", this).call(this, "BlockStatement");
    this.body = [];
  }

  _inherits(BlockStatement, BaseSyntax);

  _prototypeProperties(BlockStatement, {
    is: {

      /**
       * Check if an object is representing a BlockStatement
       *
       * @param object
       * @returns {boolean}
       */

      value: function is(object) {
        return typeof object === "object" && typeof object.type !== "undefined" && object.type === "BlockStatement";
      },
      writable: true,
      configurable: true
    }
  }, {
    appendToBody: {
      value: function appendToBody(statement) {
        this.body.push(statement);
      },
      writable: true,
      configurable: true
    }
  });

  return BlockStatement;
})(BaseSyntax);

module.exports = BlockStatement;