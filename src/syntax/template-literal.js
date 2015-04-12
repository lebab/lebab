import BaseSyntax from './base.js';
import TemplateElement from './template-element.js';

/**
 * The class to define the TemplateLiteral syntax
 *
 * @class TemplateLiteral
 */
export default
class TemplateLiteral extends BaseSyntax {

  /**
   * Create a template literal
   *
   * @constructor
   */
    constructor() {

    super('TemplateLiteral');

    this.expressions = [];
    this.quasis = [];

  }

  createFromArray(parts) {

    let isLiteral = (node) => {
      return typeof node !== 'undefined' && node.type === 'Literal';
    };

    let isString = (node) => {
      return isLiteral(node) && typeof node.value === 'string';
    };

    for (let i = 0; i < parts.length; i++) {
      let curr = parts[i];

      if (isString(curr)) {
        let element = new TemplateElement();
        curr = curr.value;

        while (isString(parts[++i])) {
          curr += parts[i].value;
        }

        i--;

        element.setValue(curr);
        this.quasis.push(element);
      } else {
        if (i === 0) {
          let element = new TemplateElement();
          element.setValue('');
          this.quasis.push(element);
        }

        if (! isLiteral(parts[i + 1])) {
          let element = new TemplateElement();
          this.quasis.push(element);

          if(typeof parts[i + 1] === 'undefined') {
            element.tail = true;
          }
        }

        this.expressions.push(curr);
      }
    }

  }

}