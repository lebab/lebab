import {matchesAst, extract} from '../../utils/matches-ast';
import isFunctionProperty from './is-function-property';

const matchObjectDefinePropertyCall = matchesAst({
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
          name: extract('className')
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        }
      },
      {
        type: 'Literal',
        value: extract('methodName')
      },
      {
        type: 'ObjectExpression',
        properties: extract('properties')
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
  let m;
  if ((m = matchObjectDefinePropertyCall(node))) {
    return {
      className: m.className,
      methodName: m.methodName,
      descriptors: m.properties.filter(isAccessorDescriptor).map(prop => {
        return {
          methodNode: prop.value,
          kind: prop.key.name,
        };
      }),
    };
  }
}
