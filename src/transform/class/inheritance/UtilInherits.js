import {matchesAst, extract} from '../../../utils/matchesAst';
import {isVarWithRequireCalls} from '../../commonjs/importCommonjs';

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
  /**
   * @param {Object} cfg
   *   @param {PotentialClass[]} cfg.potentialClasses
   */
  constructor({potentialClasses}) {
    this.potentialClasses = potentialClasses;
    this.utilNode = null;
    this.inheritsNode = null;
  }

  /**
   * Process a node and return inheritance details if found.
   * @param {Object} node
   * @param {Object} parent
   * @returns {Object}
   *            {String}   className
   *            {Node}     superClass
   *            {Object[]} replacements
   */
  process(node, parent) {
    var m;
    if (this.discoverIdentifiers(node, parent)) {
      return null;
    }
    else if ((m = this.match(node))) {
      if (this.potentialClasses[m.className]) {
        return {
          className: m.className,
          superClass: m.superClass,
          replacements: [{node, parent, replacements: []}]
        };
      }
    }
    return null;
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
   * @param {Object} parent Immediate parent node (to determine context)
   * @return {Boolean}
   */
  discoverIdentifiers(node, parent) {
    if (isVarWithRequireCalls(node)) {
      if (parent.type !== 'Program') {
        return false;
      }

      var declaration = node.declarations.filter((dec) =>
        matchesAst({
          init: {
            callee: {
              name: 'require'
            },
            arguments: (args) => args.length === 1 && args[0].value === 'util'
          }
        })(dec) ||
        matchesAst({
          init: {
            object: {
              callee: {
                name: 'require'
              },
              arguments: (args) => args.length === 1 && args[0].value === 'util'
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
  match(node) {
    return matchesAst({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: (callee) => (
          (this.utilNode !== null && matchesAst({
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: this.utilNode.name
            },
            property: {
              type: 'Identifier',
              name: 'inherits'
            }
          })(callee)) ||
          (this.inheritsNode !== null && matchesAst({
            type: 'Identifier',
            name: this.inheritsNode.name
          })(callee))
        ),
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
