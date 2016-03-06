import BaseSyntax from './base';

/**
 * The class to define the ExportNamedDeclaration syntax.
 */
export default
class ExportNamedDeclaration extends BaseSyntax {
  /**
   * Constructed with either declaration or specifiers.
   * @param {Object} cfg
   * @param {Object} cfg.declaration Any *Declaration node (optional)
   * @param {Object[]} cfg.specifiers List of specifiers (optional)
   */
  constructor({declaration, specifiers}) {
    super('ExportNamedDeclaration');
    this.declaration = declaration;
    this.specifiers = specifiers;
  }
}
