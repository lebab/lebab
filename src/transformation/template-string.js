import estraverse from 'estraverse';
import esutils from 'esutils/lib/ast.js';
import TemplateLiteral from './../syntax/template-literal.js';
import _ from 'lodash/index.js'

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: traverser
    });
  }

var operands, hasString, hasExpression;

function traverser(node) {
  if (node.type === 'BinaryExpression' && node.operator === '+') {

    operands = [];
    hasString = false;

    estraverse.traverse(node, {
      enter: detector
    });


    if (hasString && hasExpression) {
      operands = _(operands).reverse().value();

      let templateString = new TemplateLiteral();
      templateString.createFromArray(operands);
      this.skip();
      return templateString;
    }
  }
}

function detector(node) {

  if (isBinaryExpression(node) && node.operator === '+') {
    let left = node.left;
    let right = node.right;

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

  if(esutils.isExpression(node) && node.type !== 'Literal') {
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