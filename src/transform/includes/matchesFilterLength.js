import isEqualAst from '../../utils/isEqualAst';
import {matchesAst, matchesLength, extract} from '../../utils/matchesAst';

/**
 * Matches: -1
 */
export const isMinusOne = matchesAst({
  type: 'UnaryExpression',
  operator: '-',
  argument: {
    type: 'Literal',
    value: 1
  },
  prefix: true
});

/**
 * Matches: 0
 */
export const isZero = matchesAst({
  type: 'Literal',
  value: 0
});

// Matches: object.filter(param => conditional1 === conditional2).length
const matchesFilterLengthBody = matchesAst({
  type: 'MemberExpression',
  object: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: extract('object'),
      property: {
        type: 'Identifier',
        name: 'filter'
      }
    },
    arguments: matchesLength([{
      type: 'ArrowFunctionExpression',
      params: matchesLength([extract('param')]),
      body: {
        type: 'BinaryExpression',
        left: extract('conditional1'),
        operator: '===',
        right: extract('conditional2'),
      }
    }]),
  },
  property: {
    type: 'Identifier',
    name: 'length'
  }
});

function findSearchElement({param, conditional1, conditional2}) {
  if (isEqualAst(param, conditional1)) {
    return conditional2;
  }

  if (isEqualAst(param, conditional2)) {
    return conditional1;
  }
  return;
}

// Matches either of:
// - object.filter(param => param === searchElement).length
// - object.filter(param => searchElement === param).length
export function matchesFilterLengthRaw(node) {
  const matches = matchesFilterLengthBody(node);
  const searchElement = findSearchElement(matches);
  if (matches && searchElement) {
    matches.searchElement = searchElement;
    return matches;
  }
}

// Matches: 0
const matchesLengthIdentifier = extract('index', (v) => isZero(v));

// Matches either of:
// - object.filter(param => param === searchElement).length <operator> index
// - object.filter(param => searchElement === param).length <operator> index
const matchesFilterLengthNormal = matchesAst({
  type: 'BinaryExpression',
  operator: extract('operator'),
  left: matchesFilterLengthRaw,
  right: matchesLengthIdentifier,
});

// Matches either of:
// - index <operator> object.filter(param => param === searchElement).length
// - index <operator> object.filter(param => searchElement === param).length
const matchesFilterLengthReversed = matchesAst({
  type: 'BinaryExpression',
  operator: extract('operator'),
  left: matchesLengthIdentifier,
  right: matchesFilterLengthRaw,
});

// Reverses the direction of comparison operator
function reverseOperator(operator) {
  return operator.replace(/[><]/, (op) => op === '>' ? '<' : '>');
}

function reverseOperatorField(matches) {
  if (!matches) {
    return false;
  }

  return Object.assign({}, matches, {
    operator: reverseOperator(matches.operator)
  });
}

/**
 * Matches:
 *
 *    object.filter(param => param === searchElement).length <operator> index
 *    object.filter(param => searchElement === param).length <operator> index
 *    index <operator> object.filter(param => param === searchElement).length
 * or
 *    index <operator> object.filter(param => searchElement === param).length
 *
 * On success returns object with keys:
 *
 * - object
 * - searchElement
 * - operator
 * - index
 *
 * @param  {Object} node
 * @return {Object}
 */
export function matchesFilterLength(node) {
  return matchesFilterLengthNormal(node) || reverseOperatorField(matchesFilterLengthReversed(node));
}
