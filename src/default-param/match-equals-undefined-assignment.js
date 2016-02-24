import _ from 'lodash';

const isEqualsUndefinedAssignment = _.matches({
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
        type: 'BinaryExpression',
        left: {
          type: 'Identifier'
          // name: <name>
        },
        // operator: <operator>
        right: {
          type: 'Identifier',
          name: 'undefined'
        }
      },
      consequent: {
        // <consequent>
      },
      alternate: {
        // <alternate>
      }
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
  if (isEqualsUndefinedAssignment(node)) {
    const {
      expression: {
        left: {name},
        right: {
          test: {
            left: {name: name2},
            operator
          },
          consequent,
          alternate
        }
      }
    } = node;

    if (name === name2) {
      if ((operator === '===' || operator === '==') && alternate.type === 'Identifier') {
        return {name, value: consequent, node};
      }
      if ((operator === '!==' || operator === '!=') && consequent.type === 'Identifier') {
        return {name, value: alternate, node};
      }
    }
  }
}
