"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var merge = _interopRequire(require("lodash/object/merge.js"));

var codeGenerator = _interopRequire(require("escodegen"));

var astGenerator = _interopRequire(require("./utils/ast-generator.js"));

// Transformers

var classTransformation = _interopRequire(require("./transformation/classes.js"));

var templateStringTransformation = _interopRequire(require("./transformation/template-string.js"));

var arrowFunctionTransformation = _interopRequire(require("./transformation/callback-to-arrow.js"));

var Transformer = (function () {

  /**
   * @constructor
   */

  function Transformer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Transformer);

    this.ast = {};
    this.options = merge(this.constructor.defaultOptions, options);
    this.transformations = [];

    this.prepareTransformations();
  }

  _createClass(Transformer, {
    prepareTransformations: {

      /**
       * Prepare transformations array by give options
       */

      value: function prepareTransformations() {
        var _this = this;

        var shouldTransform = function (key) {
          return typeof _this.options.transformers[key] !== "undefined" && _this.options.transformers[key];
        };

        var doTransform = function (key, transformation) {
          if (shouldTransform(key)) {
            _this.transformations.push(transformation);
          }
        };

        doTransform("classes", classTransformation);
        doTransform("stringTemplates", templateStringTransformation);
        doTransform("arrowFunctions", arrowFunctionTransformation);
      }
    },
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
      }
    },
    read: {

      /**
       * Prepare an abstract syntax tree for given code in string
       *
       * @param string
       */

      value: function read(string) {

        this.ast = astGenerator.read(string, this.options);
      }
    },
    applyTransformation: {

      /**
       * Apply a transformation on the AST
       *
       * @param transformation
       */

      value: function applyTransformation(transformation) {

        transformation(this.ast);
      }
    },
    applyTransformations: {

      /**
       * Apply All transformations
       */

      value: function applyTransformations() {

        for (var i = 0; i < this.transformations.length; i++) {
          var transformation = this.transformations[i];
          this.applyTransformation(transformation);
        }
      }
    },
    out: {

      /**
       * Returns the code string
       *
       * @returns {Object}
       */

      value: function out() {
        return codeGenerator.generate(this.ast);
      }
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
      }
    }
  });

  return Transformer;
})();

module.exports = Transformer;

Transformer.defaultOptions = {
  transformers: {
    classes: true,
    stringTemplates: true,
    arrowFunctions: true
  }
};