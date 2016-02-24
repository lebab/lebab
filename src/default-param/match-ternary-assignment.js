import _ from 'lodash';

const isTernaryAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      // name: <name>
    },
    operator: '=',
    right: {
      type: 'ConditionalExpression',
      test: {
        type: 'Identifier',
        // name: <name>
      },
      consequent: {
        type: 'Identifier',
        // name: <name>
      },
      alternate: {
        // <value>
      }
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
export default function (node) {
  if (isTernaryAssignment(node)) {
    const {
      expression: {
        left: {name: name},
        right: {
          test: {name: name2},
          consequent: {name: name3},
          alternate: value
        }
      }
    } = node;

    if (name === name2 && name === name3) {
      return {name, value, node};
    }
  }
}
