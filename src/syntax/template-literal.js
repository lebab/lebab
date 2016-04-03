import BaseSyntax from './base';
import TemplateElement from './template-element';
import isString from './../utils/is-string';

/**
 * The class to define the TemplateLiteral syntax
 */
export default
class TemplateLiteral extends BaseSyntax {
  /**
   * Create a template literal
   * @param {Object[]} parts
   */
  constructor(parts) {
    super('TemplateLiteral');

    this.expressions = [];
    this.quasis = [];

    this.createFromArray(parts);
  }

  createFromArray(parts) {
    for (let i = 0; i < parts.length; i++) {
      const curr = parts[i];

      if (isString(curr)) {
        let currVal = curr.value;
        let currRaw = this.escapeForTemplate(curr.raw);

        while (isString(parts[i + 1] || {})) {
          i++;
          currVal += parts[i].value;
          currRaw += this.escapeForTemplate(parts[i].raw);
        }

        this.quasis.push(new TemplateElement({
          raw: currRaw,
          cooked: currVal
        }));
      }
      else {
        if (i === 0) {
          this.quasis.push(new TemplateElement({}));
        }

        if (!isString(parts[i + 1] || {})) {
          this.quasis.push(new TemplateElement({
            tail: typeof parts[i + 1] === 'undefined'
          }));
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
