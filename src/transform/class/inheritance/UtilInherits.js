import _ from 'lodash';
import {isAstMatch, matchesLength, extract} from '../../../utils/matchesAst';
import isVarWithRequireCalls from '../../../utils/isVarWithRequireCalls';

/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 *
 * Detects:
 *   var util = require('util');
 *   function Class1() {}
 *   function Class2() {}
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
    else if ((m = this.match(node))) {
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
  //
  // @param {Object} node
  discoverIdentifiers(node) {
    const declaration = _.find(node.declarations, (dec) =>
      isAstMatch(dec, {
        init: {
          callee: {
            name: 'require'
          },
          arguments: matchesLength([{value: 'util'}])
        }
      }) ||
      isAstMatch(dec, {
        init: {
          object: {
            callee: {
              name: 'require'
            },
            arguments: matchesLength([{value: 'util'}])
          }
        }})
    );

    if (declaration) {
      if (isAstMatch(declaration, {init: {property: {name: 'inherits'}}})) {
        this.inheritsNode = declaration.id;
      }
      else {
        this.utilNode = declaration.id;
      }
    }
  }

  // Discover usage of this.utilNode or this.inheritsNode
  //
  // Examples:
  //   util.inherits(Class, SuperClass);
  //   inherits(Class, SuperClass);
  //
  // @param {Object} node
  // @return {Object} m
  //           {String} m.className
  //           {Node} m.superClass
  match(node) {
    return isAstMatch(node, {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: (callee) => this.matchesUtil(callee) || this.matchesInherits(callee),
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

  // Match example: inherits
  matchesInherits(callee) {
    return this.inheritsNode && isAstMatch(callee, {
      type: 'Identifier',
      name: this.inheritsNode.name
    });
  }

  // Match example: util.inherits
  matchesUtil(callee) {
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
