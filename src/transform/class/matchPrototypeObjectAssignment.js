import {matches, extractAny} from 'f-matches';
import isFunctionProperty from './isFunctionProperty';
import isConstructorProperty from './isConstructorProperty';

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
      properties: extractAny('properties')
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
 * @param  {Logger} logger
 * @return {Object}
 */
export default function(node, logger) {
  const {className, properties} = matchPrototypeObjectAssignment(node);
  if (!className) {
    return;
  }

  const methods = [];
  const props = [];
  let invalidConstructor = false;

  properties.forEach(prop => {
    if (isFunctionProperty(prop)) {
      methods.push({
        propertyNode: prop,
        methodName: prop.key.name,
        methodNode: prop.value,
        kind: prop.kind,
      });
    }
    else {
      if (isConstructorProperty(prop)) {
        invalidConstructor = prop.value.name !== className && prop.value.name;
      }
      props.push({
        node: prop,
        name: prop.key.name,
        value: prop.value,
        kind: prop.kind,
      });
    }
  });

  if (invalidConstructor) {
    logger.warn(
      node,
      `Prototype object assigment for function ${className} looks like class, ` +
      `but constructor property is ${invalidConstructor}.`,
      'class'
    );
  }
  else {
    return {
      className: className,
      methods: methods,
      properties: props
    };
  }
}
