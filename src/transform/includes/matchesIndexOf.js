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

// Matches: object.indexOf(searchElement)
const matchesCallIndexOf = matchesAst({
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

// Matches: -1 or 0
const matchesIndex = extract('index', (v) => isMinusOne(v) || isZero(v));

// Matches: object.indexOf(searchElement) <operator> index
const matchesIndexOfNormal = matchesAst({
  type: 'BinaryExpression',
  operator: extract('operator'),
  left: matchesCallIndexOf,
  right: matchesIndex,
});

// Matches: index <operator> object.indexOf(searchElement)
const matchesIndexOfReversed = matchesAst({
  type: 'BinaryExpression',
  operator: extract('operator'),
  left: matchesIndex,
  right: matchesCallIndexOf,
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
