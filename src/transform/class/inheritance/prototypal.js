import multiReplaceStatement from '../../../utils/multi-replace-statement';
import {matchesAst, extract} from '../../../utils/matches-ast';

export default class UtilInherits {

  constructor({potentialClasses}) {
    this.potentialClasses = potentialClasses;
    this.prototypeAssignments = [];
  }

  process(node, parent) {
    var m;
    if ((m = this.stepOne(node))) {
      if (this.potentialClasses[m.className]) {
        this.prototypeAssignments[m.className] = {
          node,
          superClass: m.superClass
        };
        return true;
      }
    }
    else if ((m = this.stepTwo(node))) {
      var prototypeAssignment = this.prototypeAssignments[m.className];
      var potentialClass = this.potentialClasses[m.className];
      if (potentialClass && prototypeAssignment) {
        potentialClass.superClass = prototypeAssignment.superClass;
        multiReplaceStatement({parent, node, replacements: []});
        multiReplaceStatement({parent, node: prototypeAssignment.node,
          replacements: []});
        return true;
      }
    }
    return false;
  }

  /**
   * Discover variable declarator nodes for:
   *  var <this.utilNode> = require("util");
   *  var <this.inheritsNode> = require("util").inherits;
   *
   * Will store the discovered nodes in:
   *  this.utilNode
   *  this.inheritsNode
   *
   * @param {Object} node
   * @return {Boolean}
   */
  stepOne(node) {
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

  stepTwo(node) {
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

