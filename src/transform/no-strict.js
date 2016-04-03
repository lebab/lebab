import estraverse from 'estraverse';
import isString from '../utils/is-string';

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
  return isString(node) && node.value === 'use strict';
}
