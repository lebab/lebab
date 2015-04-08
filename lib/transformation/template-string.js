"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var estraverse = _interopRequire(require("estraverse"));

var esutils = _interopRequire(require("esutils/lib/ast.js"));

var TemplateLiteral = _interopRequire(require("./../syntax/template-literal.js"));

var _ = _interopRequire(require("lodash/index.js"));

module.exports = function (ast) {
  estraverse.replace(ast, {
    enter: traverser
  });
};

var operands, hasString, hasExpression;

function traverser(node) {
  if (node.type === "BinaryExpression" && node.operator === "+") {

    operands = [];
    hasString = false;

    estraverse.traverse(node, {
      enter: detector
    });

    if (hasString && hasExpression) {
      operands = _(operands).reverse().value();

      var templateString = new TemplateLiteral();
      templateString.createFromArray(operands);
      this.skip();
      return templateString;
    }
  }
}

function detector(node) {

  if (isBinaryExpression(node) && node.operator === "+") {
    var left = node.left;
    var right = node.right;

    addOperand(right);

    if (!isBinaryExpression(left)) {
      addOperand(left);

      this.skip();
    }
  } else if (isBinaryExpression(node)) {
    addOperand(node);
    this.skip();
  }
}

function addOperand(node) {
  operands.push(node);

  if (isString(node)) {
    hasString = true;
  }

  if (esutils.isExpression(node) && node.type !== "Literal") {
    hasExpression = true;
  }
}

function isLiteral(node) {
  return /Literal/.test(node.type);
}

function isString(node) {
  return isLiteral(node) && typeof node.value === "string";
}

function isBinaryExpression(node) {
  return /BinaryExpression/.test(node.type);
}