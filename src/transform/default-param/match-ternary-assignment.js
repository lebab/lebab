import {matchesAst, extract} from '../../utils/matches-ast';

const matchTernaryAssignment = matchesAst({
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
        type: 'Identifier',
        name: extract('name2')
      },
      consequent: {
        type: 'Identifier',
        name: extract('name3')
      },
      alternate: extract('value')
    }
  }
});

/**
 * Matches: <name> = <name> ? <name> : <value>;
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
export default function(node) {
  const {name, name2, name3, value} = matchTernaryAssignment(node) || {};

  if (name && name === name2 && name === name3) {
    return {name, value, node};
  }
}
