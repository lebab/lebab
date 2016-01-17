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
    constructor() {
    super('BlockStatement');
    this.body = [];
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
