import BaseSyntax from './base.js';

/**
 * The class to define the Identifier syntax
 *
 * @class Identifier
 */
export default
class Identifier extends BaseSyntax {

  /**
   * The constructor of Identifier
   *
   * @constructor
   */
    constructor() {
    super('Identifier');

    this.name = '';
    this.body = new ClassBody();
  }

}