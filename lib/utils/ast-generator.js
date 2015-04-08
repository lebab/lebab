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
 * @param options
 * @returns {Object}
 */
exports.read = read;

var acorn = _interopRequire(require("acorn"));

var fs = _interopRequire(require("fs"));

var coffee = _interopRequire(require("coffee-script"));

function readFile(file, options) {
  var _this = this;

  if (typeof options.coffee === "undefined") {
    options.coffee = /\.coffee$/.test(file);
  }

  if (options.sync) {
    var js = fs.readFileSync(file);
    return this.read(js, options);
  } else {
    fs.readFile(file, function (js) {
      if (options.callback) {
        options.callback(_this.read(js, options));
      }
    });
  }
}

function read(js, options) {

  if (options.coffee) {
    js = coffee.compile(js);
  }

  return acorn.parse(js, options);
}

exports["default"] = {
  read: read,
  readFile: readFile
};
Object.defineProperty(exports, "__esModule", {
  value: true
});