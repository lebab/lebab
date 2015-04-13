import estraverse from 'estraverse';
import esutils from 'esutils/lib/ast.js';
import TemplateLiteral from './../syntax/template-literal.js';
import typeChecker from './../utils/type-checker.js';
import _ from 'lodash';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: traverser
    });
  }

let operands, hasString, hasExpression, currentExpression;

function traverser(node) {
  if (node.type === 'BinaryExpression' && node.operator === '+') {

    operands = [];
    hasString = false;
    currentExpression = node;

    estraverse.traverse(node, {
      enter: detector
    });

    if (hasString) {
      operands = _(operands).reverse().value();

      let templateString = new TemplateLiteral();
      templateString.createFromArray(operands);
      this.skip();
      return templateString;
    }
  }
}

function detector(node, parent) {

  if (typeChecker.isBinaryExpression(node)) {
    if (node.operator === '+') {
      let left = node.left;
      let right = node.right;

      addOperand(right);

      if (!typeChecker.isBinaryExpression(left)) {
        addOperand(left);

        this.skip();
      }
    } else {
      addOperand(node);
      this.skip();
    }
  }

}

function addOperand(node) {

  if (operands.indexOf(node) === -1) {
    if (typeChecker.isString(node)) {
      hasString = true;
    }

    if (esutils.isExpression(node) && !typeChecker.isLiteral(node)) {
      hasExpression = true;
    }

    operands.push(node);
  }

}