import BaseSyntax from './base';

/**
 * The class to define the TemplateElement syntax
 */
export default
class TemplateElement extends BaseSyntax {
  /**
   * Create a template literal
   */
  constructor() {
    super('TemplateElement');

    this.value = {raw: '', cooked: ''};
    this.tail = false;
  }

  // The raw version is as it looks in source, with escapes added
  setRaw(raw) {
    this.value.raw = raw;
  }

  // The cooked varsion is the actual value
  setCooked(cooked) {
    this.value.cooked = cooked;
  }
}
