import BaseSyntax from './base.js';

/**
 * The class to define the CallExpression syntax
 *
 * @class CallExpression
 */
export default
class CallExpression extends BaseSyntax {

  /**
   * The constructor of CallExpression
   *
   * @constructor
   */
    constructor(callee, args) {
    super('CallExpression');
    this.callee = callee;
    this.arguments = args;
  }

}