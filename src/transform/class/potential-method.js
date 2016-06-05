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
   */
  constructor({name, methodNode, fullNode, parent, kind}) {
    this.name = name;
    this.methodNode = methodNode;
    this.fullNode = fullNode;
    this.parent = parent;
    this.kind = kind || 'method';
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
      static: false,
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
