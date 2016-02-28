import {matchesAst, extract} from '../../utils/matches-ast';

const matchOrAssignment = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      name: extract('name')
    },
    operator: '=',
    right: {
      type: 'LogicalExpression',
      left: {
        type: 'Identifier',
        name: extract('name2')
      },
      operator: '||',
      right: extract('value')
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
export default function (node) {
  const {name, name2, value} = matchOrAssignment(node) || {};

  if (name && name === name2) {
    return {name, value, node};
  }
}
