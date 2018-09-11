import {matches, matchesLength, extract, extractAny} from 'f-matches';

/**
 * Matches: -1
 */
export const isMinusOne = matches({
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
export const isZero = matches({
  type: 'Literal',
  value: 0
});

// Matches: object.indexOf(searchElement)
const matchesCallIndexOf = matches({
  type: 'CallExpression',
  callee: {
    type: 'MemberExpression',
    computed: false,
    object: extractAny('object'),
    property: {
      type: 'Identifier',
      name: 'indexOf'
    }
  },
  arguments: matchesLength([
    extractAny('searchElement')
  ])
});

// Matches: -1 or 0
const matchesIndex = extract('index', (v) => isMinusOne(v) || isZero(v));

// Matches: object.indexOf(searchElement) <operator> index
const matchesIndexOfNormal = matches({
  type: 'BinaryExpression',
  operator: extractAny('operator'),
  left: matchesCallIndexOf,
  right: matchesIndex,
});

// Matches: index <operator> object.indexOf(searchElement)
const matchesIndexOfReversed = matches({
  type: 'BinaryExpression',
  operator: extractAny('operator'),
  left: matchesIndex,
  right: matchesCallIndexOf,
});

// Reverses the direction of comparison operator
function reverseOperator(operator) {
  return operator.replace(/[><]/, (op) => op === '>' ? '<' : '>');
}

function reverseOperatorField(match) {
  if (!match) {
    return false;
  }

  return {
    ...match,
    operator: reverseOperator(match.operator),
  };
}

/**
 * Matches:
 *
 *    object.indexOf(searchElement) <operator> index
 *
 * or
 *
 *    index <operator> object.indexOf(searchElement)
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
export default function(node) {
  return matchesIndexOfNormal(node) || reverseOperatorField(matchesIndexOfReversed(node));
}
