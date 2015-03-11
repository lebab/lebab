import BaseSyntax from './base.js';

/**
 * The class to define the MemberExpression syntax
 *
 * @class MemberExpression
 */
export default
class MemberExpression extends BaseSyntax {

  /**
   * The constructor of MemberExpression
   *
   * @constructor
   */
    constructor(object, property) {
    super('MemberExpression');
    this.object = object;
    this.property = property;
  }

}