import {matchesAst, matchesLength, extract} from '../../../utils/matchesAst';

/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 *
 * Detects:
 *   function Class1() {}
 *   function Class2() {}
 *   Class1.prototype = Object.create(Class2.prototype);
 *   Class1.prototype.constructor = Class1;
 * and:
 *   function Class1() {}
 *   function Class2() {}
 *   Class1.prototype = new Class2();
 *   Class1.prototype.constructor = Class1;
 */
export default class Prototypal {
  constructor() {
    this.prototypeAssignments = [];
  }

  /**
   * Process a node and return inheritance details if found.
   * @param {Object} node
   * @param {Object} parent
   * @returns null or {Object} m
   *                    {String}   m.className
   *                    {Node}     m.superClass
   *                    {Object[]} m.relatedExpressions
   */
  process(node, parent) {
    var m;
    if ((m = this.matchPrototypeAssignment(node))) {
      this.prototypeAssignments[m.className] = {
        node,
        parent,
        superClass: m.superClass
      };
    }
    else if ((m = this.matchConstructorAssignment(node))) {
      var prototypeAssignment = this.prototypeAssignments[m.className];
      if (prototypeAssignment) {
        return {
          className: m.className,
          superClass: prototypeAssignment.superClass,
          relatedExpressions: [
            {node, parent},
            {
              node: prototypeAssignment.node,
              parent: prototypeAssignment.parent
            }
          ]
        };
      }
    }
    return null;
  }

  // Match prototype assignments.
  //
  // Examples:
  //   Class1.prototype = new Class2();
  //   Class1.prototype = Object.create(Class2);
  //
  // @param {Object} node
  // @return {Object} m
  //           {String} m.className
  //           {Node} m.superClass
  matchPrototypeAssignment(node) {
    // Match example: Class1.prototype = new Class2();
    const matchNewAssignment = matchesAst({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: extract('className')
          },
          property: {
            type: 'Identifier',
            name: 'prototype'
          }
        },
        right: {
          type: 'NewExpression',
          callee: extract('superClass')
        }
      }
    });

    // Match example: Class1.prototype = Object.create(Class2);
    const matchObjectCreateAssignment = matchesAst({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: extract('className')
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
            object: extract('superClass'),
            property: {
              type: 'Identifier',
              name: 'prototype'
            }
          }])
        }
      }
    });

    return matchNewAssignment(node) ||
           matchObjectCreateAssignment(node);
  }

  // Match constructor reassignment.
  //
  // Example:
  //   Class1.prototype.constructor = Class1;
  //
  // @param {Object} node
  // @return {Object} m
  //           {String} m.className
  matchConstructorAssignment(node) {
    return matchesAst({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: extract('className')
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
          name: extract('className')
        }
      }
    })(node);
  }
}
