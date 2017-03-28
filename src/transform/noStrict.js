import traverser from '../traverser';
import isString from '../utils/isString';
import copyComments from '../utils/copyComments';

export default function(ast) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (node.type === 'ExpressionStatement' && isUseStrictString(node.expression)) {
        const index = parent.body.indexOf(node);
        const next = parent.body[index + 1];

        if (next) {
          copyComments({
            from: node,
            to: next,
            prepend: true,
          });
        }

        this.remove();
      }
    }
  });
}

function isUseStrictString(node) {
  return isString(node) && node.value === 'use strict';
}
