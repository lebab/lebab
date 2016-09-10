import traverser from '../../traverser';
import matchesIndexOf from './matchesIndexOf';
import {isIncludesComparison, isNotIncludesComparison} from './comparison';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchesIndexOf(node);
      if (matches && isIncludesComparison(matches)) {
        return createIncludes(matches);
      }
      if (matches && isNotIncludesComparison(matches)) {
        return createNot(createIncludes(matches));
      }
    }
  });
}

function createNot(argument) {
  return {
    type: 'UnaryExpression',
    operator: '!',
    prefix: true,
    argument,
  };
}

function createIncludes({object, searchElement}) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: object,
      property: {
        type: 'Identifier',
        name: 'includes'
      }
    },
    arguments: [searchElement]
  };
}
