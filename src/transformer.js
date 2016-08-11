import 'babel-polyfill';
import recast from 'recast';
import parser from './parser';
import Logger from './logger';

// Transforms
import classTransform from './transform/class';
import templateTransform from './transform/template';
import arrowTransform from './transform/arrow';
import letTransform from './transform/let';
import defaultParamTransform from './transform/default-param';
import argSpreadTransform from './transform/arg-spread';
import objMethodTransform from './transform/obj-method';
import objShorthandTransform from './transform/obj-shorthand';
import noStrictTransform from './transform/no-strict';
import commonjsTransform from './transform/commonjs';
import exponentTransform from './transform/exponent';
import multiVarTransform from './transform/multi-var';

const transformsMap = {
  'class': classTransform,
  'template': templateTransform,
  'arrow': arrowTransform,
  'let': letTransform,
  'default-param': defaultParamTransform,
  'arg-spread': argSpreadTransform,
  'obj-method': objMethodTransform,
  'obj-shorthand': objShorthandTransform,
  'no-strict': noStrictTransform,
  'commonjs': commonjsTransform,
  'exponent': exponentTransform,
  'multi-var': multiVarTransform,
};

/**
 * Runs transforms on code.
 */
export default class Transformer {
  /**
   * @param {String[]} transformNames List of transforms to enable
   */
  constructor(transformNames = []) {
    this.transforms = transformNames.map(name => transformsMap[name]);
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
