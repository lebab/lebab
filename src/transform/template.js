import estraverse from 'estraverse';
import TemplateLiteral from './../syntax/template-literal';
import typeChecker from './../utils/type-checker';
import _ from 'lodash';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'BinaryExpression' && node.operator === '+') {
        const operands = detectOperands(node);

        if (operands.some(op => typeChecker.isString(op))) {
          const templateString = new TemplateLiteral();
          templateString.createFromArray(_.reverse(operands));
          this.skip();
          return templateString;
        }
      }
    }
  });
}

function detectOperands(ast) {
  const operands = [];

  estraverse.traverse(ast, {
    enter(node) {
      if (typeChecker.isBinaryExpression(node)) {
        if (node.operator === '+') {
          const left = node.left;
          const right = node.right;

          operands.push(right);

          if (!typeChecker.isBinaryExpression(left)) {
            operands.push(left);

            this.skip();
          }
        }
        else {
          operands.push(node);
          this.skip();
        }
      }
    }
  });

  return operands;
}
