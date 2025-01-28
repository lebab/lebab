import {matches, extractAny} from 'f-matches';
import {isAccessorDescriptor} from './matchObjectDefinePropertyCall.js';

const matchObjectDefinePropertiesCallOnPrototype = matches({
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
        name: 'defineProperties'
      }
    },
    arguments: [
      {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: extractAny('className')
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        }
      },
      {
        type: 'ObjectExpression',
        properties: extractAny('methods')
      }
    ]
  }
});

const matchObjectDefinePropertiesCall = matches({
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
        name: 'defineProperties'
      }
    },
    arguments: [
      {
        type: 'Identifier',
        name: extractAny('className')
      },
      {
        type: 'ObjectExpression',
        properties: extractAny('methods')
      }
    ]
  }
});

export const matchDefinedProperties = matches({
  type: 'Property',
  key: {
    type: 'Identifier',
    name: extractAny('methodName')
  },
  computed: false,
  value: {
    type: 'ObjectExpression',
    properties: extractAny('properties')
  }
});


/**
 * Matches: Object.defineProperties(<className>.prototype, {
 *              <methodName>: {
 *                <kind>: <methodNode>,
 *              }
 *              ...
 *          })
 *
 * When node matches returns an array of objects with the extracted fields for each method:
 *
 * [{
 *   - className
 *   - methodName
 *   - descriptors:
 *       - propertyNode
 *       - methodNode
 *       - kind
 * }]
 *
 * @param  {Object} node
 * @return {Object[] | undefined}
 */
export default function(node) {
  let {className, methods} = matchObjectDefinePropertiesCallOnPrototype(node);

  let isStatic = false;
  if (!className) {
    ({className, methods} = matchObjectDefinePropertiesCall(node));
    isStatic = true;
  }

  if (className) {
    return methods.map(methodNode => {
      const {methodName, properties} = matchDefinedProperties(methodNode);

      return {
        className: className,
        methodName: methodName,
        methodNode: methodNode,
        descriptors: properties.filter(isAccessorDescriptor).map(prop => {
          return {
            propertyNode: prop,
            methodNode: prop.value,
            kind: prop.key.name,
          };
        }),
        static: isStatic
      };
    });
  }
}
