import multiReplaceStatement from './../../utils/multi-replace-statement';

/**
 * Represents a potential class method to be created.
 */
export default
class PotentialMethod {
  /**
   * @param {Object} cfg
   *   @param {String} cfg.name Method name
   *   @param {Object} cfg.methodNode
   *   @param {Object} cfg.fullNode
   *   @param {Object} cfg.parent
   *   @param {String} cfg.kind Either 'get' or 'set' (optional)
   *   @param {Boolean} cfg.static True to make static method (optional)
   */
  constructor(cfg) {
    this.name = cfg.name;
    this.methodNode = cfg.methodNode;
    this.fullNode = cfg.fullNode;
    this.parent = cfg.parent;
    this.kind = cfg.kind || 'method';
    this.static = cfg.static || false;
  }

  /**
   * True when method body is empty.
   * @return {Boolean}
   */
  isEmpty() {
    return this.methodNode.body.body.length === 0;
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
        params: this.methodNode.params,
        defaults: this.methodNode.defaults,
        body: this.methodNode.body,
        generator: false,
        expression: false,
      },
      kind: this.kind,
      static: this.static,
      comments: this.fullNode && this.fullNode.comments,
    };
  }

  /**
   * Removes original prototype assignment node from AST.
   */
  remove() {
    multiReplaceStatement(this.parent, this.fullNode, []);
  }
}
