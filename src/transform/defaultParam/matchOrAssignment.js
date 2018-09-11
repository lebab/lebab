import {matches, extractAny} from 'f-matches';

const matchOrAssignment = matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      name: extractAny('name')
    },
    operator: '=',
    right: {
      type: 'LogicalExpression',
      left: {
        type: 'Identifier',
        name: extractAny('name2')
      },
      operator: '||',
      right: extractAny('value')
    }
  }
});

/**
 * Matches: <name> = <name> || <value>;
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
  const {name, name2, value} = matchOrAssignment(node) || {};

  if (name && name === name2) {
    return {name, value, node};
  }
}
