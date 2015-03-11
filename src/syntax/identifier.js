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
    constructor(name) {
    super('Identifier');

    this.name = name;
  }

}