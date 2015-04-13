import BaseSyntax from './base.js';
import VariableDeclarator from './variable-declarator';

/**
 * The class to define the LetExpression syntax
 *
 * @class LetExpression
 */
export default
class LetExpression extends BaseSyntax {

  /**
   * The constructor of LetExpression
   *
   * @constructor
   */
  constructor() {
    super('LetExpression');

    this.head = new VariableDeclarator();
    this.body = null;
  }
}
