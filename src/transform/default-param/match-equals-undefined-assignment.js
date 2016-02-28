import {matchesAst, extract} from '../../utils/matches-ast';

const matchEqualsUndefinedAssignment = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      name: extract('name')
    },
    operator: '=',
    right: {
      type: 'ConditionalExpression',
      test: {
        type: 'BinaryExpression',
        left: {
          type: 'Identifier',
          name: extract('name2')
        },
        operator: extract('operator'),
        right: {
          type: 'Identifier',
          name: 'undefined'
        }
      },
      consequent: extract('consequent'),
      alternate: extract('alternate')
    }
  }
});

/**
 * Matches: <name> = <name> === undefined ? <value> : <name>;
 *
 * When node matches returns the extracted fields:
 *
 * - name
 * - value
 * - node (the entire node)
 *
 * @param {Object} node
 * @return {Object}
 */
export default function (node) {
  const {name, name2, operator, consequent, alternate} = matchEqualsUndefinedAssignment(node) || {};

  if (name === name2) {
    if ((operator === '===' || operator === '==') && alternate.type === 'Identifier' && alternate.name === name) {
      return {name, value: consequent, node};
    }
    if ((operator === '!==' || operator === '!=') && consequent.type === 'Identifier' && consequent.name === name) {
      return {name, value: alternate, node};
    }
  }
}
