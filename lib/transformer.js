'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _merge = require('lodash/object/merge.js');

var _merge2 = _interopRequireWildcard(_merge);

var _codeGenerator = require('escodegen');

var _codeGenerator2 = _interopRequireWildcard(_codeGenerator);

var _astGenerator = require('./utils/ast-generator.js');

var _astGenerator2 = _interopRequireWildcard(_astGenerator);

// Transformers

var _classTransformation = require('./transformation/classes.js');

var _classTransformation2 = _interopRequireWildcard(_classTransformation);

var _templateStringTransformation = require('./transformation/template-string.js');

var _templateStringTransformation2 = _interopRequireWildcard(_templateStringTransformation);

var _arrowFunctionTransformation = require('./transformation/arrow-functions.js');

var _arrowFunctionTransformation2 = _interopRequireWildcard(_arrowFunctionTransformation);

var Transformer = (function () {

  /**
   * @constructor
   */

  function Transformer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Transformer);

    this.ast = {};
    this.options = _merge2['default'](this.constructor.defaultOptions, options);
    this.transformations = [];

    this.prepareTransformations();
  }

  _createClass(Transformer, [{
    key: 'prepareTransformations',

    /**
     * Prepare transformations array by give options
     */
    value: function prepareTransformations() {
      var _this = this;

      var shouldTransform = function shouldTransform(key) {
        return typeof _this.options.transformers[key] !== 'undefined' && _this.options.transformers[key];
      };

      var doTransform = function doTransform(key, transformation) {
        if (shouldTransform(key)) {
          _this.transformations.push(transformation);
        }
      };

      doTransform('classes', _classTransformation2['default']);
      doTransform('stringTemplates', _templateStringTransformation2['default']);
      doTransform('arrowFunctions', _arrowFunctionTransformation2['default']);
    }
  }, {
    key: 'readFile',

    /**
     * Prepare the abstract syntax tree for given file
     *
     * @param filename
     */
    value: function readFile(filename) {

      this.ast = _astGenerator2['default'].readFile(filename, {
        sync: true,
        ecmaVersion: 6
      });
    }
  }, {
    key: 'read',

    /**
     * Prepare an abstract syntax tree for given code in string
     *
     * @param string
     */
    value: function read(string) {

      this.ast = _astGenerator2['default'].read(string, this.options);
    }
  }, {
    key: 'applyTransformation',

    /**
     * Apply a transformation on the AST
     *
     * @param transformation
     */
    value: function applyTransformation(transformation) {

      transformation(this.ast);
    }
  }, {
    key: 'applyTransformations',

    /**
     * Apply All transformations
     */
    value: function applyTransformations() {

      for (var i = 0; i < this.transformations.length; i++) {
        var transformation = this.transformations[i];
        this.applyTransformation(transformation);
      }
    }
  }, {
    key: 'out',

    /**
     * Returns the code string
     *
     * @returns {Object}
     */
    value: function out() {
      return _codeGenerator2['default'].generate(this.ast);
    }
  }, {
    key: 'writeFile',

    /**
     * Writes the code on file
     *
     * @param filename
     * @param callback
     */
    value: function writeFile(filename, callback) {

      var code = this.out();

      if (typeof callback === 'function') {
        _fs2['default'].writeFile(filename, code, callback);
      } else {
        _fs2['default'].writeFileSync(filename, code);
      }
    }
  }]);

  return Transformer;
})();

exports['default'] = Transformer;

Transformer.defaultOptions = {
  transformers: {
    classes: true,
    stringTemplates: true,
    arrowFunctions: true
  }
};
module.exports = exports['default'];