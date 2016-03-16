import estraverse from 'estraverse';
import typeChecker from '../utils/type-checker';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'ExpressionStatement' && isUseStrictString(node.expression)) {
        this.remove();
      }
    }
  });
}

function isUseStrictString(node) {
  return typeChecker.isString(node) && node.value === 'use strict';
}
