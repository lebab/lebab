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
    this.value.raw = value;
    this.value.cooked = value;
  }

  setRaw(raw) {
    this.value.raw = raw;
  }

  setCooked(cooked) {
    this.value.cooked = cooked;
  }

}