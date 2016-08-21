import 'babel-polyfill';
import recast from 'recast';
import parser from './parser';
import Logger from './logger';
import builtinTransforms from './builtin-transforms';

/**
 * Runs transforms on code.
 */
export default class Transformer {
  /**
   * @param {String[]} transformNames List of transforms to enable
   */
  constructor(transformNames = []) {
    this.transforms = transformNames.map(name => builtinTransforms.get(name));
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
      const ast = recast.parse(js, {parser});

      this.transforms.forEach(transformer => {
        transformer(ast.program, logger);
      });

      return recast.print(ast).code;
    });
  }

  // strips hashBang comment,
  // invokes callback with normal js,
  // then re-adds the hashBang comment back
  ignoringHashBangComment(code, callback) {
    const [/* all */, hashBang, js] = code.match(/^(\s*#!.*?\r?\n|)([\s\S]*)$/);
    return hashBang + callback(js);
  }
}
