/**
 * A function to which we potentially add a rest parameter.
 */
export default class PotentialRestFunction {
  /**
   * @param {Object} node The Function node
   */
  constructor(node) {
    this.node = node;
    this.argumentsNodes = [];
  }

  /**
   * True when the function has any parameters at all
   * @return {Boolean}
   */
  hasParams() {
    return this.node.params.length > 0;
  }

  /**
   * Registers use of `arguments`
   * @param {Object} node
   */
  addArgumentsNode(node) {
    this.argumentsNodes.push(node);
  }

  /**
   * Returns all nodes that use arguments.
   * But only when we can transform them.
   * @return {Object[]}
   */
  getTransformableArgumentsNodes() {
    return this.conflicting ? [] : this.argumentsNodes;
  }

  /**
   * Marks that the arguments of this function can't be transformed.
   */
  markConflicting() {
    this.conflicting = true;
  }

  /**
   * Returns function parameters.
   * When previously marked with addRestParam() includes ResetElement to parameter list.
   * Otherwise returns the existing parameters unmodified.
   * @return {Object[]}
   */
  getParams() {
    if (this.argumentsNodes.length > 0 && !this.conflicting) {
      return [
        {
          type: 'RestElement',
          argument: {
            type: 'Identifier',
            name: 'args'
          }
        }
      ];
    }
    else {
      return this.node.params;
    }
  }
}
