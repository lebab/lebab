import traverser from '../traverser';
import copyComments from '../utils/copyComments';

export default function(ast) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (node.type === 'Directive' && node.value.type === 'DirectiveLiteral' && node.value.value === 'use strict') {
        copyComments({
          from: node,
          to: parent,
        });

        this.remove();
      }
    }
  });
}
