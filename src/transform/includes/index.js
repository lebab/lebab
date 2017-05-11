import traverser from '../../traverser';
import matchesIndexOf from './matchesIndexOf';
import isInIfCondition from './isInIfCondition';
import {
  matchesFilterLengthRaw, matchesFilterLength
} from './matchesFilterLength';
import {
  isIncludesIndexOfComparison, isNotIncludesIndexOfComparison,
  isIncludesFilterLengthComparison, isNotIncludesFilterLengthComparison,
} from './comparison';

export default function(ast) {
  traverser.replace(ast, {
    enter(node, parent) {
      const matchesI = matchesIndexOf(node);
      const matchesFLRaw = matchesFilterLengthRaw(node);
      const matchesFL = matchesFilterLength(node);

      if (matchesI && isIncludesIndexOfComparison(matchesI)) {
        return createIncludes(matchesI);
      }
      if (matchesI && isNotIncludesIndexOfComparison(matchesI)) {
        return createNot(createIncludes(matchesI));
      }
      if (matchesFLRaw && isInIfCondition(node, parent)) {
        return createIncludes(matchesFLRaw);
      }
      if (matchesFL && isIncludesFilterLengthComparison(matchesFL)) {
        return createIncludes(matchesFL);
      }
      if (matchesFL && isNotIncludesFilterLengthComparison(matchesFL)) {
        return createNot(createIncludes(matchesFL));
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
