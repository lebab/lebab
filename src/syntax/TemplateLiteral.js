import BaseSyntax from './BaseSyntax';

/**
 * The class to define the TemplateLiteral syntax
 */
export default
class TemplateLiteral extends BaseSyntax {
  /**
   * Create a template literal
   * @param {Object[]} quasis String parts
   * @param {Object[]} expressions Expressions between string parts
   */
  constructor({quasis, expressions}) {
    super('TemplateLiteral');

    this.quasis = quasis;
    this.expressions = expressions;
  }
}
