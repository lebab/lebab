import traverser from '../../traverser';
import isEqualAst from './../../utils/isEqualAst';
import {matches, extract} from 'f-matches';
import extractComments from './extractComments';
import multiReplaceStatement from './../../utils/multiReplaceStatement';

/**
 * Represents a potential class method to be created.
 */
export default
class PotentialMethod {
  /**
   * @param {Object} cfg
   *   @param {String} cfg.name Method name
   *   @param {Object} cfg.methodNode
   *   @param {Object} cfg.fullNode Node to remove after converting to class
   *   @param {Object[]} cfg.commentNodes Nodes to extract comments from
   *   @param {Object} cfg.parent
   *   @param {String} cfg.kind Either 'get' or 'set' (optional)
   *   @param {Boolean} cfg.static True to make static method (optional)
   */
  constructor(cfg) {
    this.name = cfg.name;
    this.methodNode = cfg.methodNode;
    this.fullNode = cfg.fullNode;
    this.commentNodes = cfg.commentNodes || [];
    this.parent = cfg.parent;
    this.kind = cfg.kind || 'method';
    this.static = cfg.static || false;
  }

  /**
   * Sets the superClass node.
   * @param {Node} superClass
   */
  setSuperClass(superClass) {
    this.superClass = superClass;
  }

  /**
   * True when method body is empty.
   * @return {Boolean}
   */
  isEmpty() {
    return this.getBodyBlock().body.length === 0;
  }

  /**
   * Transforms the potential method to actual MethodDefinition node.
   * @return {MethodDefinition}
   */
  toMethodDefinition() {
    return {
      type: 'MethodDefinition',
      key: {
        type: 'Identifier',
        name: this.name,
      },
      computed: false,
      value: {
        type: 'FunctionExpression',
        async: this.methodNode.async,
        params: this.methodNode.params,
        defaults: this.methodNode.defaults,
        body: this.getBody(),
        generator: false,
        expression: false,
      },
      kind: this.kind,
      static: this.static,
      comments: extractComments(this.commentNodes),
    };
  }

  /**
   * Removes original prototype assignment node from AST.
   */
  remove() {
    multiReplaceStatement({
      parent: this.parent,
      node: this.fullNode,
      replacements: [],
    });
  }

  // To be overridden in subclasses
  getBody() {
    if (this.superClass) {
      return this.transformSuperCalls(this.getBodyBlock());
    }
    else {
      return this.getBodyBlock();
    }
  }

  getBodyBlock() {
    if (this.methodNode.body.type === 'BlockStatement') {
      return this.methodNode.body;
    }
    else {
      return {
        type: 'BlockStatement',
        body: [
          {
            type: 'ReturnStatement',
            argument: this.methodNode.body
          }
        ]
      };
    }
  }

  // Transforms method body by replacing
  // SuperClass.prototype.foo.call(this, ...args) --> super.foo(...args)
  transformSuperCalls(body) {
    return traverser.replace(body, {
      enter: (node) => {
        const m = this.matchSuperCall(node);
        if (m) {
          node.expression.callee = {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Super'
            },
            property: m.method
          };

          node.expression.arguments = node.expression.arguments.slice(1);
        }
      }
    });
  }

  matchSuperCall(node) {
    return matches({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          computed: false,
          object: {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'MemberExpression',
              computed: false,
              object: (obj) => isEqualAst(obj, this.superClass),
              property: {
                type: 'Identifier',
                name: 'prototype'
              }
            },
            property: extract('method', {
              type: 'Identifier',
            })
          },
          property: {
            type: 'Identifier',
            name: 'call'
          }
        },
        arguments: [
          {
            type: 'ThisExpression'
          }
        ]
      }
    }, node);
  }
}
