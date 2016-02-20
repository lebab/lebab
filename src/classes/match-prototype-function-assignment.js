import _ from 'lodash';

const isPrototypeFunctionAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          // name: <className>
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        },
      },
      property: {
        type: 'Identifier',
        // name: <methodName>
      }
    },
    operator: '=',
    right: {
      type: 'FunctionExpression'
    }
  }
});

/**
 * Matches: <className>.prototype.<methodName> = function () { ... }
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - methodName
 * - methodNode
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function (node) {
  if (isPrototypeFunctionAssignment(node)) {
    const {
      expression: {
        left: {
          object: {
            object: {name: className}
          },
          property: {name: methodName}
        },
        right: methodNode
      }
    } = node;

    return {className, methodName, methodNode};
  }
}
