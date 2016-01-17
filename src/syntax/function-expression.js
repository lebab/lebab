import BaseSyntax from './base.js';
import BlockStatement from './block-statement.js';

/**
 * The class to define the FunctionExpression syntax
 *
 * @class FunctionExpression
 */
export default
class FunctionExpression extends BaseSyntax {

  /**
   * The constructor of FunctionExpression
   *
   * @constructor
   */
    constructor() {
    super('FunctionExpression');

    this.body = new BlockStatement();
    this.params = [];
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.id = null;
  }

}
