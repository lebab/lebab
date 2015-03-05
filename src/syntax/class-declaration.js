import BaseSyntax from './base.js';

/**
 * The class to define the ClassDeclaration syntax
 *
 * @class ClassDeclaration
 */
export default
class ClassDeclaration extends BaseSyntax {

  /**
   * The constructor of ClassDeclaration
   *
   * @constructor
   */
    constructor() {
    super('ClassDeclaration');

    this.name = '';
  }

}