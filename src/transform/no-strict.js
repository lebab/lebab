import traverser from '../traverser';
import isString from '../utils/is-string';

export default function(ast) {
  traverser.replace(ast, {
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
