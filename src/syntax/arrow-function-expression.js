import BaseSyntax from './base.js';

/**
 * The class to define the ArrowFunctionExpression syntax
 *
 * @class ArrowFunctionExpression
 */
export default
class ArrowFunctionExpression extends BaseSyntax {

  /**
   * The constructor of ArrowFunctionExpression
   *
   * @constructor
   * @param {Object} cfg
   * @param {Node} cfg.body
   * @param {Node[]} cfg.params
   * @param {Node[]} cfg.defaults
   * @param {Node|null} cfg.rest
   */
  constructor({body, params, defaults, rest}) {
    super('ArrowFunctionExpression');

    this.body = body;
    this.params = params;
    this.defaults = defaults;
    this.rest = rest;
    this.generator = false;
    this.id = null;
  }

}
