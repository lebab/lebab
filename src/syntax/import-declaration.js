import BaseSyntax from './base.js';

/**
 * The class to define the ImportDeclaration syntax
 *
 * @class ImportDeclaration
 */
export default
class ImportDeclaration extends BaseSyntax {

  /**
   * @param {Object} cfg
   * @param {ImportSpecifier|ImportDefaultSpecifier} cfg.specifier
   * @param {Literal} cfg.source String literal containing library path
   */
  constructor({specifier, source}) {
    super('ImportDeclaration');
    this.specifiers = [specifier];
    this.source = source;
  }

}
