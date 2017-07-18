import BaseSyntax from './BaseSyntax';

/**
 * The class to define the ArrowFunctionExpression syntax
 */
export default
class ArrowFunctionExpression extends BaseSyntax {
  /**
   * The constructor of ArrowFunctionExpression
   *
   * @param {Object} cfg
   * @param {Node} cfg.body
   * @param {Node[]} cfg.params
   * @param {Node[]} cfg.defaults
   * @param {Node} cfg.rest (optional)
   */
  constructor({body, params, defaults, rest, async}) {
    super('ArrowFunctionExpression');

    this.body = body;
    this.params = params;
    this.defaults = defaults;
    this.rest = rest;
    this.async = async;
    this.generator = false;
    this.id = undefined;
  }
}
