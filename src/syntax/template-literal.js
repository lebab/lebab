import BaseSyntax from './base';
import TemplateElement from './template-element';
import typeChecker from './../utils/type-checker';

/**
 * The class to define the TemplateLiteral syntax
 */
export default
class TemplateLiteral extends BaseSyntax {
  /**
   * Create a template literal
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
        let currVal = curr.value;
        let currRaw = this.escapeForTemplate(curr.raw);

        while (typeChecker.isString(parts[++i])) {
          currVal += parts[i].value;
          currRaw += this.escapeForTemplate(parts[i].raw);
        }

        i--;

        element.setCooked(currVal);
        element.setRaw(currRaw);
        this.quasis.push(element);
      }
      else {
        if (i === 0) {
          let element = new TemplateElement();
          this.quasis.push(element);
        }

        if (! typeChecker.isString(parts[i + 1])) {
          let element = new TemplateElement();
          this.quasis.push(element);

          if (typeof parts[i + 1] === 'undefined') {
            element.tail = true;
          }
        }

        this.expressions.push(curr);
      }
    }
  }

  // Strip surrounding quotes, escape backticks and unescape escaped quotes
  escapeForTemplate(raw) {
    return raw
      .replace(/^['"]|['"]$/g, '')
      .replace(/`/g, '\\`')
      .replace(/\\(['"])/g, '$1');
  }
}
