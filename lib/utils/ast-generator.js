'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * This function reads a js file and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param file
 * @param options
 * @returns {Object}
 */
exports.readFile = readFile;

/**
 * This function reads a js string and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param js
 * @param options
 * @returns {Object}
 */
exports.read = read;

var _acorn = require('acorn');

var _acorn2 = _interopRequireWildcard(_acorn);

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _coffee = require('coffee-script');

var _coffee2 = _interopRequireWildcard(_coffee);

function readFile(file, options) {
  var _this = this;

  if (typeof options.coffee === 'undefined') {
    options.coffee = /\.coffee$/.test(file);
  }

  if (options.sync) {
    var js = _fs2['default'].readFileSync(file);
    return this.read(js, options);
  } else {
    _fs2['default'].readFile(file, function (js) {
      if (options.callback) {
        options.callback(_this.read(js, options));
      }
    });
  }
}

function read(js, options) {

  if (options.coffee) {
    js = _coffee2['default'].compile(js);
  }

  return _acorn2['default'].parse(js, options);
}

exports['default'] = {
  read: read,
  readFile: readFile
};