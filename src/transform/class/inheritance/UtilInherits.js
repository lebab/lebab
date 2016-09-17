import _ from 'lodash';
import {isAstMatch, matchesLength, extract} from '../../../utils/matchesAst';
import isVarWithRequireCalls from '../../../utils/isVarWithRequireCalls';

/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 *
 * Detects:
 *
 *   var util = require('util');
 *   ...
 *   util.inherits(Class1, Class2);
 */
export default class UtilInherits {
  constructor() {
    this.utilNode = undefined;
    this.inheritsNode = undefined;
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
    if (isVarWithRequireCalls(node) && parent.type === 'Program') {
      this.discoverIdentifiers(node);
    }
    else if ((m = this.matchUtilInherits(node))) {
      return {
        className: m.className,
        superClass: m.superClass,
        relatedExpressions: [{node, parent}]
      };
    }
  }

  // Discover variable declarator nodes for:
  //  var <this.utilNode> = require("util");
  //  var <this.inheritsNode> = require("util").inherits;
  //
  // Will store the discovered nodes in:
  //  this.utilNode
  //  this.inheritsNode
  discoverIdentifiers(node) {
    let declaration;
    if ((declaration = _.find(node.declarations, dec => this.isRequireUtil(dec)))) {
      this.utilNode = declaration.id;
    }
    else if ((declaration = _.find(node.declarations, dec => this.isRequireUtilInherits(dec)))) {
      this.inheritsNode = declaration.id;
    }
  }

  // Matches: <id> = require("util")
  isRequireUtil(dec) {
    return isAstMatch(dec, {
      init: {
        callee: {
          name: 'require'
        },
        arguments: matchesLength([{
          value: 'util'
        }])
      }
    });
  }

  // Matches: <id> = require("util").inherits
  isRequireUtilInherits(dec) {
    return isAstMatch(dec, {
      init: {
        object: {
          callee: {
            name: 'require'
          },
          arguments: matchesLength([{
            value: 'util'
          }])
        },
        property: {
          name: 'inherits'
        }
      }
    });
  }

  // Discover usage of this.utilNode or this.inheritsNode
  //
  // Matches: util.inherits(<className>, <superClass>);
  // Matches: inherits(<className>, <superClass>);
  matchUtilInherits(node) {
    return isAstMatch(node, {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: (callee) => this.isUtilInherits(callee) || this.isInherits(callee),
        arguments: [
          {
            type: 'Identifier',
            name: extract('className')
          },
          extract('superClass')
        ]
      }
    });
  }

  // Matches: inherits
  isInherits(callee) {
    return this.inheritsNode && isAstMatch(callee, {
      type: 'Identifier',
      name: this.inheritsNode.name
    });
  }

  // Matches: util.inherits
  isUtilInherits(callee) {
    return this.utilNode && isAstMatch(callee, {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: this.utilNode.name
      },
      property: {
        type: 'Identifier',
        name: 'inherits'
      }
    });
  }
}
