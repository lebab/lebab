import BaseSyntax from './base.js';

/**
 * The class to define the ReturnStatement syntax
 *
 * @class FunctionExpression
 */
export default
class ReturnStatement extends BaseSyntax {

  /**
   * The constructor of ReturnStatement
   *
   * @constructor
   */
    constructor(argument) {
    super('ReturnStatement');

    this.argument = argument;
  }

}