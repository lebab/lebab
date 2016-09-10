import BaseSyntax from './BaseSyntax';

/**
 * The class to define the TemplateElement syntax
 */
export default
class TemplateElement extends BaseSyntax {
  /**
   * Create a template literal
   *
   * @param {Object} cfg
   * @param {String} cfg.raw As it looks in source, with escapes added
   * @param {String} cfg.cooked The actual value
   * @param {Boolean} cfg.tail True to signify the last element in TemplateLiteral
   */
  constructor({raw = '', cooked = '', tail = false}) {
    super('TemplateElement');

    this.value = {raw, cooked};
    this.tail = tail;
  }
}
