import BaseSyntax from './base.js';

/**
 * The class to define the TemplateElement syntax
 *
 * @class TemplateElement
 */
export default
class TemplateElement extends BaseSyntax {

  /**
   * Create a template literal
   *
   * @constructor
   */
    constructor() {

    super('TemplateElement');

    this.value = {raw: '', cooked: ''};
    this.tail = false;

  }

  setValue(value) {
    // The raw version is as it looks in source, with escapes added
    this.setRaw(value.replace(/`/g, '\\`'));
    // The cooked varsion is the actual value
    this.setCooked(value);
  }

  setRaw(raw) {
    this.value.raw = raw;
  }

  setCooked(cooked) {
    this.value.cooked = cooked;
  }

}
