import BaseSyntax from './base.js';
import TemplateElement from './template-element.js';
import typeChecker from './../utils/type-checker.js';

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

    for (let i = 0; i < parts.length; i++) {
      let curr = parts[i];

      if (typeChecker.isString(curr)) {
        let element = new TemplateElement();
        curr = curr.value;

        while (typeChecker.isString(parts[++i])) {
          curr += parts[i].value;
        }

        i--;

        element.setValue(curr);
        this.quasis.push(element);
      } else {
        if (i === 0) {
          let element = new TemplateElement();
          this.quasis.push(element);
        }

        if (! typeChecker.isString(parts[i + 1])) {
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