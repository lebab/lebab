import traverser from '../traverser';
import {matchesAst, matchesLength, extract} from '../utils/matchesAst';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchesIndexOf(node) || matchesIndexOfReversed(node);
      if (matches && isIncludesComparison(matches)) {
        return createIncludes(matches);
      }
      if (matches && isNotIncludesComparison(matches)) {
        return createNot(createIncludes(matches));
      }
    }
  });
}

function isIncludesComparison({operator, index}) {
  switch (operator) {
  case '!==':
  case '!=':
  case '>':
    return isMinusOne(index);
  case '>=':
    return isZero(index);
  default:
    return false;
  }
}

function isNotIncludesComparison({operator, index}) {
  switch (operator) {
  case '===':
  case '==':
    return isMinusOne(index);
  case '<':
    return isZero(index);
  default:
    return false;
  }
}

var isMinusOne = matchesAst({
  type: 'UnaryExpression',
  operator: '-',
  argument: {
    type: 'Literal',
    value: 1
  },
  prefix: true
});

var isZero = matchesAst({
  type: 'Literal',
  value: 0
});

var matchesCallIndexOf = matchesAst({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    computed: false,
    object: extract('object'),
    property: {
      type: 'Identifier',
      name: 'indexOf'
    }
  },
  arguments: matchesLength([
    extract('searchElement')
  ])
});

var matchesIndex = extract('index', (v) => isMinusOne(v) || isZero(v));

var matchesIndexOf = matchesAst({
  type: 'BinaryExpression',
  operator: extract('operator'),
  left: matchesCallIndexOf,
  right: matchesIndex,
});

var matchesIndexOfReversed = matchesAst({
  type: 'BinaryExpression',
  operator: extract('operator'),
  left: matchesIndex,
  right: matchesCallIndexOf,
});

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
