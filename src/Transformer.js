import {parse, print} from 'recast';
import parser from './Parser';
import Logger from './Logger';

/**
 * Runs transforms on code.
 */
export default class Transformer {
  /**
   * @param {Function[]} transforms List of transforms to perform
   */
  constructor(transforms = []) {
    this.transforms = transforms;
  }

  /**
   * Tranforms code using all configured transforms.
   *
   * @param {String} code Input ES5 code
   * @return {Object} Output ES6 code
   */
  run(code) {
    const logger = new Logger();

    return {
      code: this.applyAllTransforms(code, logger),
      warnings: logger.getWarnings(),
    };
  }

  applyAllTransforms(code, logger) {
    return this.ignoringHashBangComment(code, (js) => {
      const ast = parse(js, {parser});

      this.transforms.forEach(transformer => {
        transformer(ast.program, logger);
      });

      return print(ast, {
        lineTerminator: this.detectLineTerminator(code),
        objectCurlySpacing: false,
      }).code;
    });
  }

  // strips hashBang comment,
  // invokes callback with normal js,
  // then re-adds the hashBang comment back
  ignoringHashBangComment(code, callback) {
    const [/* all */, hashBang, js] = code.match(/^(\s*#!.*?\r?\n|)([\s\S]*)$/);
    return hashBang + callback(js);
  }

  detectLineTerminator(code) {
    const hasCRLF = /\r\n/.test(code);
    const hasLF = /[^\r]\n/.test(code);

    return (hasCRLF && !hasLF) ? '\r\n' : '\n';
  }
}
