import {matchesAst, extract} from '../../../utils/matches-ast';

export default class UtilInherits {

  constructor({potentialClasses}) {
    this.potentialClasses = potentialClasses;
    this.prototypeAssignments = [];
  }

  process(node, parent) {
    var m;
    if ((m = this.matchPrototypeAssignment(node))) {
      if (this.potentialClasses[m.className]) {
        this.prototypeAssignments[m.className] = {
          node,
          parent,
          superClass: m.superClass
        };
      }
    }
    else if ((m = this.matchConstructorAssignment(node))) {
      var prototypeAssignment = this.prototypeAssignments[m.className];
      if (this.potentialClasses[m.className] && prototypeAssignment) {
        return {
          className: m.className,
          superClass: prototypeAssignment.superClass,
          replacements: [
            {node, parent, replacements: []},
            {
              node: prototypeAssignment.node,
              parent: prototypeAssignment.parent,
              replacements: []
            }
          ]
        };
      }
    }
    return null;
  }

  /**
   * @param {Object} node
   * @return {Boolean}
   */
  matchPrototypeAssignment(node) {
    return matchesAst({
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
          callee: {
            type: 'Identifier',
            name: extract('superClass')
          }
        }
      }
    })(node);
  }

  /**
   * @param {Object} node
   * @return {Boolean}
   */
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
