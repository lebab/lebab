"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var astGenerator = _interopRequire(require("./utils/ast-generator.js"));

var codeGenerator = _interopRequire(require("escodegen"));

var fs = _interopRequire(require("fs"));

var Transformer = (function () {

  /**
   * @constructor
   */

  function Transformer() {
    _classCallCheck(this, Transformer);

    this.ast = {};
  }

  _prototypeProperties(Transformer, null, {
    readFile: {

      /**
       * Prepare the abstract syntax tree for given file
       *
       * @param filename
       */

      value: function readFile(filename) {
        this.ast = astGenerator.readFile(filename, {
          sync: true,
          ecmaVersion: 6
        });
      },
      writable: true,
      configurable: true
    },
    read: {

      /**
       * Prepare an abstract syntax tree for given code in string
       *
       * @param string
       */

      value: function read(string) {
        this.ast = astGenerator.read(string);
      },
      writable: true,
      configurable: true
    },
    applyTransformation: {

      /**
       * Apply a transformation on the AST
       *
       * @param transformation
       */

      value: function applyTransformation(transformation) {
        transformation(this.ast);
      },
      writable: true,
      configurable: true
    },
    out: {

      /**
       * Returns the code string
       *
       * @returns {Object}
       */

      value: function out() {
        return codeGenerator.generate(this.ast);
      },
      writable: true,
      configurable: true
    },
    writeFile: {

      /**
       * Writes the code on file
       *
       * @param filename
       * @param callback
       */

      value: function writeFile(filename, callback) {
        var code = this.out();

        if (typeof callback === "function") {
          fs.writeFile(filename, code, callback);
        } else {
          fs.writeFileSync(filename, code);
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Transformer;
})();

module.exports = Transformer;