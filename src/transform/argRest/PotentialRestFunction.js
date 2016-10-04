/**
 * A function to which we potentially add a rest parameter.
 */
export default class PotentialRestFunction {
  /**
   * @param {Object} node The Function node
   */
  constructor(node) {
    this.node = node;
  }

  /**
   * True when the function has any parameters at all
   * @return {Boolean}
   */
  hasParams() {
    return this.node.params.length > 0;
  }

  /**
   * Marks function to be transformed into version with rest parameter.
   */
  addRestParam() {
    this.hasRestParam = true;
  }

  /**
   * Returns function parameters.
   * When previously marked with addRestParam() includes ResetElement to parameter list.
   * Otherwise returns the existing parameters unmodified.
   * @return {Object[]}
   */
  getParams() {
    if (this.hasRestParam) {
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
