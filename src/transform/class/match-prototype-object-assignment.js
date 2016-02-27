import matchesAst from '../../utils/matches-ast';
import isFunctionProperty from './is-function-property';

const isPrototypeObjectAssignment = matchesAst({
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
      type: 'ObjectExpression',
      properties: (props) => props.every(isFunctionProperty)
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
