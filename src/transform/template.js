import estraverse from 'estraverse';
import TemplateLiteral from './../syntax/template-literal';
import typeChecker from './../utils/type-checker';
import _ from 'lodash';

let operands;
let hasString;

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'BinaryExpression' && node.operator === '+') {

        operands = [];
        hasString = false;

        detect(node);

        if (hasString) {
          operands = _(operands).reverse().value();

          const templateString = new TemplateLiteral();
          templateString.createFromArray(operands);
          this.skip();
          return templateString;
        }
      }
    }
  });
}

function detect(ast) {
  estraverse.traverse(ast, {
    enter(node) {
      if (typeChecker.isBinaryExpression(node)) {
        if (node.operator === '+') {
          const left = node.left;
          const right = node.right;

          addOperand(right);

          if (!typeChecker.isBinaryExpression(left)) {
            addOperand(left);

            this.skip();
          }
        }
        else {
          addOperand(node);
          this.skip();
        }
      }
    }
  });
}

function addOperand(node) {

  if (operands.indexOf(node) === -1) {
    if (typeChecker.isString(node)) {
      hasString = true;
    }

    operands.push(node);
  }

}
