import BaseSyntax from './BaseSyntax';

/**
 * The class to define the ImportDeclaration syntax
 */
export default
class ImportDeclaration extends BaseSyntax {
  /**
   * @param {Object} cfg
   * @param {ImportSpecifier[]|ImportDefaultSpecifier[]} cfg.specifiers
   * @param {Literal} cfg.source String literal containing library path
   */
  constructor({specifiers, source}) {
    super('ImportDeclaration');
    this.specifiers = specifiers;
    this.source = source;
  }
}
