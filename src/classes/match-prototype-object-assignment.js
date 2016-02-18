import _ from 'lodash';
import isFunctionProperty from './is-function-property.js';

const isPrototypeObjectAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
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
    operator: '=',
    right: {
      type: 'ObjectExpression'
      // properties: <properties>
    }
  }
});

/**
 * Matches: <className>.prototype = {
 *              <methodName>: <methodNode>,
 *              ...
 *          };
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - methods
 *     - methodName
 *     - methodNode
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function (node) {
  if (isPrototypeObjectAssignment(node)) {
    const {
      expression: {
        left: {
          object: {
            name: className
          }
        },
        right: {properties}
      }
    } = node;

    if (properties.every(isFunctionProperty)) {
      return {
        className,
        methods: properties.map(prop => {
          return {
            methodName: prop.key.name,
            methodNode: prop.value
          };
        })
      };
    }
  }
}
