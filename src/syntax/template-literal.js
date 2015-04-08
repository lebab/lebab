import BaseSyntax from './base.js';
import TemplateElement from './template-element.js';
import esutils from 'esutils/lib/ast.js';
import utils from 'util';

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
    let isString = (node) => {
      return typeof node !== 'undefined' && node.type === 'Literal' && typeof node.value === 'string';
    };

    let isExpression = (node) => {
      return typeof node !== 'undefined' && esutils.isExpression(node);
    };

    for (let i = 0; i < parts.length; i++) {
      let curr = parts[i];

      //console.log(curr);

      if (isString(curr)) {
        let element = new TemplateElement();
        curr = curr.value;

        while (isString(parts[++i])) {
          curr += parts[i].value;
        }

        element.setValue(curr);
        this.quasis.push(element);

        i--;
      } else {
        if (i === 0) {
          let element = new TemplateElement();
          element.setValue('');
          this.quasis.push(element);
        }

        if (typeof parts[i + 1] === 'undefined') {
          let element = new TemplateElement();
          element.tail = true;
          this.quasis.push(element);
        } else if (parts[i + 1] .type !== 'Literal') {
          let element = new TemplateElement();
          this.quasis.push(element);
          //console.log(parts[i + 1]);
        }

        this.expressions.push(curr);
      }
    }

    //console.log(JSON.stringify(this));

  }

}