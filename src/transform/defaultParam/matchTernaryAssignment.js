import {matches, extractAny} from 'f-matches';

const matchTernaryAssignment = matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      name: extractAny('name')
    },
    operator: '=',
    right: {
      type: 'ConditionalExpression',
      test: {
        type: 'Identifier',
        name: extractAny('name2')
      },
      consequent: {
        type: 'Identifier',
        name: extractAny('name3')
      },
      alternate: extractAny('value')
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
