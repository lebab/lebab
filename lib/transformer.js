"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var astGenerator = _interopRequire(require("./utils/ast-generator.js"));

var codeGenerator = _interopRequire(require("escodegen"));

var fs = _interopRequire(require("fs"));

var Transformer = (function () {
  function Transformer() {
    _classCallCheck(this, Transformer);
  }

  _prototypeProperties(Transformer, null, {
    readFile: {
      value: function readFile(filename) {
        this.ast = astGenerator.readFile(filename, {
          sync: true
        });
      },
      writable: true,
      configurable: true
    },
    read: {
      value: function read(string) {
        this.ast = astGenerator.read(string);
      },
      writable: true,
      configurable: true
    },
    applyTransformation: {
      value: function applyTransformation(transformation) {
        transformation(this.ast);
      },
      writable: true,
      configurable: true
    },
    out: {
      value: function out() {
        return codeGenerator.generate(this.ast);
      },
      writable: true,
      configurable: true
    },
    writeFile: {
      value: function writeFile(filename) {
        fs.writeFileSync(filename, this.out());
      },
      writable: true,
      configurable: true
    }
  });

  return Transformer;
})();

module.exports = Transformer;