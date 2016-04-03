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
          this.skip();
          return new TemplateLiteral(operands);
        }
      }
    }
  });
}

function detectOperands(node) {
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    return _.flatten([
      detectOperands(node.left),
      detectOperands(node.right)
    ]);
  }
  else {
    return [node];
  }
}
