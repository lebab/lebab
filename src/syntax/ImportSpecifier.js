import BaseSyntax from './BaseSyntax';

/**
 * The class to define the ImportSpecifier syntax
 */
export default
class ImportSpecifier extends BaseSyntax {
  /**
   * @param {Object} cfg
   * @param {Identifier} cfg.local  The local variable
   * @param {Identifier} cfg.imported  The imported variable
   */
  constructor({local, imported}) {
    super('ImportSpecifier');
    this.local = local;
    this.imported = imported;
  }
}
