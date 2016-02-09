import BaseSyntax from './base.js';

/**
 * The class to define the VariableDeclaration syntax
 *
 * @class VariableDeclaration
 */
export default
class VariableDeclaration extends BaseSyntax {

  /**
   * The constructor of VariableDeclaration
   *
   * @param {String} kind
   * @param {VariableDeclarator[]} declarations
   */
  constructor(kind, declarations) {
    super('VariableDeclaration');

    this.kind = kind;
    this.declarations = declarations;
  }
}
