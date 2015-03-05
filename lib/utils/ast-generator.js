"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

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
 * @returns {Object}
 */
exports.read = read;

var acorn = _interopRequire(require("acorn"));

var fs = _interopRequire(require("fs"));

function readFile(file, options) {
  var ast;

  if (options.sync) {
    var js = fs.readFileSync(file);
    ast = acorn.parse(js, options);
    return ast;
  } else {
    fs.readFile(function (js) {
      ast = acorn.parse(js, options);

      if (options.callback) {
        options.callback(ast);
      }
    });
  }
}

function read(js, options) {

  return acorn(js, options);
}

exports["default"] = {
  read: read,
  readFile: readFile
};
Object.defineProperty(exports, "__esModule", {
  value: true
});