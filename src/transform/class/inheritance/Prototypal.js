import {matches, matchesLength, extractAny} from 'f-matches';

/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 *
 * Detects:
 *
 *   Class1.prototype = Object.create(Class2.prototype);
 *
 * or:
 *
 *   Class1.prototype = new Class2();
 *
 * optionally followed by:
 *
 *   Class1.prototype.constructor = Class1;
 */
export default class Prototypal {
  constructor() {
    this.foundSuperclasses = {};
  }

  /**
   * Process a node and return inheritance details if found.
   * @param {Object} node
   * @param {Object} parent
   * @returns {Object/undefined} m
   *                    {String}   m.className
   *                    {Node}     m.superClass
   *                    {Object[]} m.relatedExpressions
   */
  process(node, parent) {
    let m;
    if ((m = this.matchNewAssignment(node) || this.matchObjectCreateAssignment(node))) {
      this.foundSuperclasses[m.className] = m.superClass;

      return {
        className: m.className,
        superClass: m.superClass,
        relatedExpressions: [
          {node, parent},
        ]
      };
    }
    else if ((m = this.matchConstructorAssignment(node))) {
      const superClass = this.foundSuperclasses[m.className];
      if (superClass && m.className === m.constructorClassName) {
        return {
          className: m.className,
          superClass: superClass,
          relatedExpressions: [
            {node, parent},
          ]
        };
      }
    }
  }

  // Matches: <className>.prototype = new <superClass>();
  matchNewAssignment(node) {
    return matches({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: extractAny('className')
          },
          property: {
            type: 'Identifier',
            name: 'prototype'
          }
        },
        right: {
          type: 'NewExpression',
          callee: extractAny('superClass')
        }
      }
    }, node);
  }

  // Matches: <className>.prototype = Object.create(<superClass>);
  matchObjectCreateAssignment(node) {
    return matches({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: extractAny('className')
          },
          property: {
            type: 'Identifier',
            name: 'prototype'
          }
        },
        right: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'Object'
            },
            property: {
              type: 'Identifier',
              name: 'create'
            }
          },
          arguments: matchesLength([{
            type: 'MemberExpression',
            object: extractAny('superClass'),
            property: {
              type: 'Identifier',
              name: 'prototype'
            }
          }])
        }
      }
    }, node);
  }

  // Matches: <className>.prototype.constructor = <constructorClassName>;
  matchConstructorAssignment(node) {
    return matches({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: extractAny('className')
            },
            property: {
              type: 'Identifier',
              name: 'prototype'
            }
          },
          property: {
            type: 'Identifier',
            name: 'constructor'
          }
        },
        right: {
          type: 'Identifier',
          name: extractAny('constructorClassName')
        }
      }
    }, node);
  }
}
