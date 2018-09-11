import {matches} from 'f-matches';
import traverser from '../traverser';

const isMathPow = matches({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    computed: false,
    object: {
      type: 'Identifier',
      name: 'Math'
    },
    property: {
      type: 'Identifier',
      name: 'pow'
    }
  },
  arguments: (args) => args.length === 2
});

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isMathPow(node)) {
        return {
          type: 'BinaryExpression',
          operator: '**',
          left: node.arguments[0],
          right: node.arguments[1],
        };
      }
    }
  });
}
