import _ from 'lodash';

const isTypeofUndefinedAssignment = _.matches({
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
          type: 'UnaryExpression',
          operator: 'typeof',
          prefix: true,
          argument: {
            type: 'Identifier'
            // name: <name>
          }
        },
        // operator: <operator>
        right: {
          type: 'Literal',
          value: 'undefined'
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
 * Matches: <name> = typeof <name> === 'undefined' ? <value> : <name>;
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
  if (isTypeofUndefinedAssignment(node)) {
    const {
      expression: {
        left: {name},
        right: {
          test: {
            left: {
              argument: {name: name2}
            },
            operator
          },
          consequent,
          alternate
        }
      }
    } = node;

    if (name === name2) {
      if ((operator === '===' || operator === '==') && alternate.type === 'Identifier' && alternate.name === name) {
        return {name, value: consequent, node};
      }
      if ((operator === '!==' || operator === '!=') && consequent.type === 'Identifier' && consequent.name === name) {
        return {name, value: alternate, node};
      }
    }
  }
}
