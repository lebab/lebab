import BaseSyntax from './base.js';

/**
 * The class to define the VariableDeclarator syntax
 *
 * @class VariableDeclarator
 */
export default
class VariableDeclarator extends BaseSyntax {

  /**
   * The constructor of VariableDeclarator
   *
   * @constructor
   */
  constructor() {
    super('VariableDeclarator');

    this.id = null;
    this.init = null;
  }
}