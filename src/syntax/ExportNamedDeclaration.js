import BaseSyntax from './BaseSyntax';

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
   * @param {Object[]} cfg.comments Comments data (optional)
   */
  constructor({declaration, specifiers, comments}) {
    super('ExportNamedDeclaration');
    this.declaration = declaration;
    this.specifiers = specifiers;
    this.comments = comments;
  }
}
