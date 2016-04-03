import estraverse from 'estraverse';
import TemplateLiteral from './../syntax/template-literal';
import typeChecker from './../utils/type-checker';
import _ from 'lodash';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (isPlusExpression(node)) {
        const operands = detectOperands(node);

        if (operands.some(op => typeChecker.isString(op))) {
          this.skip();
          return new TemplateLiteral(operands);
        }
      }
    }
  });
}

function detectOperands(node) {
  if (isPlusExpression(node)) {
    return _.flatten([
      detectOperands(node.left),
      detectOperands(node.right)
    ]);
  }
  else {
    return [node];
  }
}

function isPlusExpression(node) {
  return node.type === 'BinaryExpression' && node.operator === '+';
}
