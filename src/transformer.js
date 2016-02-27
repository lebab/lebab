import _ from 'lodash';
import recast from 'recast';

// Transforms
import classTransform from './transform/class';
import templateStringTransform from './transform/template-string';
import arrowFunctionTransform from './transform/arrow-functions';
import letTransform from './transform/let';
import defaultParamTransform from './transform/default-param';
import objectMethodsTransform from './transform/object-methods';
import objectShorthandsTransform from './transform/object-shorthands';
import noStrictTransform from './transform/no-strict';
import commonjsTransform from './transform/commonjs';

const transformsMap = {
  'class': classTransform,
  'template': templateStringTransform,
  'arrow': arrowFunctionTransform,
  'let': letTransform,
  'default-param': defaultParamTransform,
  'obj-method': objectMethodsTransform,
  'obj-shorthand': objectShorthandsTransform,
  'no-strict': noStrictTransform,
  'commonjs': commonjsTransform,
};

/**
 * Runs transforms on code.
 */
export default
class Transformer {
  /**
   * @param {Object} transforms List of transforms to enable
   */
  constructor(transforms={}) {
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
      const ast = recast.parse(js);

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
    const [all, hashBang, js] = code.match(/^(\s*#!.*?\r?\n|)([\s\S]*)$/); // jshint ignore:line
    return hashBang + callback(js);
  }
}
