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

      if (typeChecker.isString(curr)) {
        let currVal = curr.value;
        let currRaw = this.escapeForTemplate(curr.raw);

        while (typeChecker.isString(parts[++i])) {
          currVal += parts[i].value;
          currRaw += this.escapeForTemplate(parts[i].raw);
        }

        i--;

        this.quasis.push(new TemplateElement({
          raw: currRaw,
          cooked: currVal
        }));
      }
      else {
        if (i === 0) {
          this.quasis.push(new TemplateElement({}));
        }

        if (!typeChecker.isString(parts[i + 1])) {
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
