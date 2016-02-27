import _ from 'lodash';

const isOrAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      // name: <name>
    },
    operator: '=',
    right: {
      type: 'LogicalExpression',
      left: {
        type: 'Identifier',
        // name: <name>
      },
      operator: '||',
      right: {
        // <value>
      }
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
  if (isOrAssignment(node)) {
    const {
      expression: {
        left: {name: name},
        right: {
          left: {name: nameAgain},
          right: value
        }
      }
    } = node;

    if (name === nameAgain) {
      return {name, value, node};
    }
  }
}
