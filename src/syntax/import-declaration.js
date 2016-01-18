import BaseSyntax from './base.js';
import ImportDefaultSpecifier from './import-default-specifier.js';

/**
 * The class to define the ImportDeclaration syntax
 *
 * @class ImportDeclaration
 */
export default
class ImportDeclaration extends BaseSyntax {

  /**
   * @param {Identifier} identifier  Variable for default import
   * @param {Literal} source String literal containing library path
   */
  constructor(identifier, source) {
    super('ImportDeclaration');
    this.specifiers = [
      new ImportDefaultSpecifier(identifier)
    ];
    this.source = source;
  }

}
