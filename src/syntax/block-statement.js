import BaseSyntax from './base.js';

/**
 * The class to define the BlockStatement syntax
 *
 * @class BlockStatement
 */
export default
class BlockStatement extends BaseSyntax {

  /**
   * The constructor of BlockStatement
   *
   * @constructor
   */
    constructor(callee, args) {
    super('BlockStatement');
    this.body = [];
  }

  appendToBody(statement) {
    this.body.push(statement);
  }

  /**
   * Check if an object is representing a BlockStatement
   *
   * @param object
   * @returns {boolean}
   */
  static is(object) {
    return typeof object === 'object' && typeof object.type !== 'undefined' && object.type === 'BlockStatement';
  }

}