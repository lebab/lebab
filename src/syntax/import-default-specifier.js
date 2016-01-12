import BaseSyntax from './base.js';

/**
 * The class to define the ImportDefaultSpecifier syntax
 *
 * @class ImportDefaultSpecifier
 */
export default
class CallExpression extends BaseSyntax {

  /**
   * @param {Identifier} local  The local variable where to import
   */
  constructor(local) {
    super('ImportDefaultSpecifier');
    this.local = local;
  }

}
