'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _estraverse = require('estraverse');

var _estraverse2 = _interopRequireWildcard(_estraverse);

var _esutils = require('esutils/lib/ast.js');

var _esutils2 = _interopRequireWildcard(_esutils);

var _TemplateLiteral = require('./../syntax/template-literal.js');

var _TemplateLiteral2 = _interopRequireWildcard(_TemplateLiteral);

var _import = require('lodash/index.js');

var _import2 = _interopRequireWildcard(_import);

exports['default'] = function (ast) {
  _estraverse2['default'].replace(ast, {
    enter: traverser
  });
};

var operands, hasString, hasExpression;

function traverser(node) {
  if (node.type === 'BinaryExpression' && node.operator === '+') {

    operands = [];
    hasString = false;

    _estraverse2['default'].traverse(node, {
      enter: detector
    });

    if (hasString && hasExpression) {
      operands = _import2['default'](operands).reverse().value();

      var templateString = new _TemplateLiteral2['default']();
      templateString.createFromArray(operands);
      this.skip();
      return templateString;
    }
  }
}

function detector(node) {

  if (isBinaryExpression(node) && node.operator === '+') {
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

  if (_esutils2['default'].isExpression(node) && node.type !== 'Literal') {
    hasExpression = true;
  }
}

function isLiteral(node) {
  return /Literal/.test(node.type);
}

function isString(node) {
  return isLiteral(node) && typeof node.value === 'string';
}

function isBinaryExpression(node) {
  return /BinaryExpression/.test(node.type);
}
module.exports = exports['default'];