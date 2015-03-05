import BaseSyntax from './base.js';

/**
 * The class to define the ClassBody syntax
 *
 * @class ClassBody
 */
export default
class ClassBody extends BaseSyntax {

  /**
   * The constructor of ClassBody
   *
   * @constructor
   */
    constructor() {
    super('BaseSyntax');
    this.body = [];
  }

}