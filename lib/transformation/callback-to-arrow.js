"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var estraverse = _interopRequire(require("estraverse"));

var utils = _interopRequire(require("util"));

var ArrowExpression = _interopRequire(require("./../syntax/arrow-expression.js"));

var ThisExpression = _interopRequire(require("./../syntax/this-expression.js"));

var _ = _interopRequire(require("lodash"));

module.exports = function (ast) {
  estraverse.replace(ast, {
    enter: callBackToArrow
  });
};

function callBackToArrow(node, parent) {
  if (node.type === "FunctionExpression" && parent.type === "CallExpression" && !hasThis(node)) {
    var arrow = new ArrowExpression();
    arrow.body = node.body;
    arrow.params = node.params;
    arrow.rest = node.rest;
    arrow.defaults = node.defaults;
    arrow.generator = node.generator;
    arrow.id = node.id;

    return arrow;
  }
}

var objectProps = ["body", "expression", "left", "right", "object"];

function hasThis(node) {
  if (_.isArray(node)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = node[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var sub = _step.value;

        var result = hasThis(sub);
        if (result) return result;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return false;
  }
  if (node.type === "ThisExpression") {
    return true;
  }var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = objectProps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var prop = _step2.value;

      if (node[prop]) return hasThis(node[prop]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return false;
}