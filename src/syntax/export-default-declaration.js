import BaseSyntax from './base.js';

/**
 * The class to define the ExportDefaultDeclaration syntax
 */
export default
class ExportDefaultDeclaration extends BaseSyntax {
  /**
   * @param {Node} declaration
   */
  constructor(declaration) {
    super('ExportDefaultDeclaration');
    this.declaration = declaration;
  }
}
