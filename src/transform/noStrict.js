import traverser from '../traverser';
import isString from '../utils/isString';
import copyComments from '../utils/copyComments';

export default function(ast) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (node.type === 'ExpressionStatement' && isUseStrictString(node.expression)) {
        copyComments({
          from: node,
          to: parent,
        });

        this.remove();
      }
    }
  });
}

function isUseStrictString(node) {
  return isString(node) && node.value === 'use strict';
}
