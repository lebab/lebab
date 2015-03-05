import BaseSyntax from './base.js';

/**
 * The class to define the ClassBody syntax
 *
 * @class ClassBody
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

    this.body = [];
    this.params = [];
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.id = null;
  }

}