import {matchesAst, extract} from '../../utils/matches-ast';
import isFunctionProperty from './is-function-property';

const matchPrototypeObjectAssignment = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: extract('className')
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
 *     - methodName
 *     - methodNode
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
          methodName: prop.key.name,
          methodNode: prop.value
        };
      })
    };
  }
}
