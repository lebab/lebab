import BaseSyntax from './base.js';
import BlockStatement from './block-statement.js';

/**
 * The class to define the ArrowExpression syntax
 *
 * @class ArrowExpression
 */
export default
class ArrowExpression extends BaseSyntax {

  /**
   * The constructor of ArrowExpression
   *
   * @constructor
   */
  constructor() {
    super('ArrowFunctionExpression');

    this.body = new BlockStatement();
    this.params = [];
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.id = null;
  }

  appendToBody(statement) {
    this.body.appendToBody(statement);
  }

}