import _ from 'lodash';
import recast from 'recast';

// Transformers
import classTransformation from './transform/classes';
import templateStringTransformation from './transform/template-string';
import arrowFunctionTransformation from './transform/arrow-functions';
import letTransformation from './transform/let';
import defaultParamTransformation from './transform/default-parameters';
import objectMethodsTransformation from './transform/object-methods';
import objectShorthandsTransformation from './transform/object-shorthands';
import noStrictTransformation from './transform/no-strict';
import commonjsTransformation from './transform/commonjs';

const transformsMap = {
  'class': classTransformation,
  'template': templateStringTransformation,
  'arrow': arrowFunctionTransformation,
  'let': letTransformation,
  'default-param': defaultParamTransformation,
  'obj-method': objectMethodsTransformation,
  'obj-shorthand': objectShorthandsTransformation,
  'no-strict': noStrictTransformation,
  'commonjs': commonjsTransformation,
};

/**
 * Runs transformers on code.
 */
export default
class Transformer {
  /**
   * @param {Object} transformers List of transformers to enable
   */
  constructor(transformers={}) {
    this.transformers = _(transformers)
      .pickBy(enabled => enabled)
      .map((enabled, key) => transformsMap[key])
      .value();
  }

  /**
   * Tranforms code using all configured transformers.
   *
   * @param {String} code Input ES5 code
   * @return {String} Output ES6 code
   */
  run(code) {
    return this.ignoringHashBangComment(code, (js) => {
      const ast = recast.parse(js);

      this.transformers.forEach(transformer => {
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
