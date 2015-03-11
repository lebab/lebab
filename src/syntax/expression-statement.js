import BaseSyntax from './base.js';

/**
 * The class to define the ExpressionStatement syntax
 *
 * @class FunctionExpression
 */
export default
class ExpressionStatement extends BaseSyntax {

  /**
   * The constructor of ExpressionStatement
   *
   * @constructor
   */
    constructor(expression) {
    super('ExpressionStatement');

    this.expression = expression;
  }

}