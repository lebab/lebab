import {matchesAst, matchesLength, extract} from '../../../utils/matchesAst';
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
   * @returns null or {Object} m
   *                    {String}   m.className
   *                    {Node}     m.superClass
   *                    {Object[]} m.relatedExpressions
   */
  process(node, parent) {
    var m;
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
    return null;
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
    var declaration = node.declarations.filter((dec) =>
      matchesAst({
        init: {
          callee: {
            name: 'require'
          },
          arguments: matchesLength([{value: 'util'}])
        }
      })(dec) ||
      matchesAst({
        init: {
          object: {
            callee: {
              name: 'require'
            },
            arguments: matchesLength([{value: 'util'}])
          }
        }})(dec)
    )[0];

    if (declaration) {
      if (matchesAst({init: {property: {name: 'inherits'}}})(declaration)) {
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
    // Match example: util.inherits
    const matchesUtil = (callee) => {
      return this.utilNode && matchesAst({
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: this.utilNode.name
        },
        property: {
          type: 'Identifier',
          name: 'inherits'
        }
      })(callee);
    };

    // Match example: inherits
    const matchesInherits = (callee) => {
      return this.inheritsNode && matchesAst({
        type: 'Identifier',
        name: this.inheritsNode.name
      })(callee);
    };

    return matchesAst({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: (callee) => matchesUtil(callee) || matchesInherits(callee),
        arguments: [
          {
            type: 'Identifier',
            name: extract('className')
          },
          extract('superClass')
        ]
      }
    })(node);
  }
}
