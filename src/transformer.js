import 'babel/polyfill';
import _ from 'lodash';
import recast from 'recast';
import parser from './parser';

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
import noNamespaceTransform from './transform/no-namespace';
import commonjsTransform from './transform/commonjs';

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
  'no-namespace': noNamespaceTransform,
  'commonjs': commonjsTransform,
};

/**
 * Runs transforms on code.
 */
export default class Transformer {
  /**
   * @param {Object} transforms List of transforms to enable
   */
  constructor(transforms = {}) {
    this.transforms = _(transforms)
      .pickBy(enabled => enabled)
      .map((enabled, key) => transformsMap[key])
      .value();
  }

  /**
   * Tranforms code using all configured transforms.
   *
   * @param {String} code Input ES5 code
   * @return {String} Output ES6 code
   */
  run(code) {
    return this.ignoringHashBangComment(code, (js) => {
      const ast = recast.parse(js, {parser});

      this.transforms.forEach(transformer => {
        transformer(ast.program);
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
