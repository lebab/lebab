import _ from 'lodash';
import isFunctionProperty from './is-function-property.js';

const isObjectDefinePropertyCall = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'Object'
      },
      property: {
        type: 'Identifier',
        name: 'defineProperty'
      }
    },
    arguments: [
      {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          // name: <SomeClass>
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        }
      },
      {
        type: 'Literal',
        // value: <string>
      },
      {
        type: 'ObjectExpression',
      }
    ]
  }
});

function isAccessorDescriptor(node) {
  return isFunctionProperty(node) &&
    (node.key.name === 'get' || node.key.name === 'set');
}

/**
 * Matches: Object.defineProperty(<className>.prototype, "<methodName>", {
 *              <kind>: <methodNode>,
 *              ...
 *          })
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - methodName
 * - descriptors:
 *     - methodNode
 *     - kind
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function (node) {
  if (isObjectDefinePropertyCall(node)) {
    const {
      expression: {
        arguments: [ // jshint ignore:line
          {object: {name: className}},
          {value: methodName},
          {properties},
        ]
      }
    } = node;

    return {
      className,
      methodName,
      descriptors: properties.filter(isAccessorDescriptor).map(prop => {
        return {
          methodNode: prop.value,
          kind: prop.key.name,
        };
      }),
    };
  }
}
