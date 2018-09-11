import {matches, extract, extractAny} from 'f-matches';
import isFunctionProperty from './isFunctionProperty';

const matchPrototypeObjectAssignment = matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: extractAny('className')
      },
      property: {
        type: 'Identifier',
        name: 'prototype'
      },
    },
    operator: '=',
    right: {
      type: 'ObjectExpression',
      properties: extract('properties', props => props.every(isFunctionProperty))
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
 *     - propertyNode
 *     - methodName
 *     - methodNode
 *     - kind
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function(node) {
  const {className, properties} = matchPrototypeObjectAssignment(node);

  if (className) {
    return {
      className: className,
      methods: properties.map(prop => {
        return {
          propertyNode: prop,
          methodName: prop.key.name,
          methodNode: prop.value,
          kind: prop.kind,
        };
      })
    };
  }
}
