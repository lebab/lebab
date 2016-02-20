import _ from 'lodash';
import recast from 'recast';

// Transformers
import classTransformation from './transformation/classes.js';
import templateStringTransformation from './transformation/template-string.js';
import arrowFunctionTransformation from './transformation/arrow-functions.js';
import letTransformation from './transformation/let.js';
import defaultArgsTransformation from './transformation/default-arguments.js';
import objectMethodsTransformation from './transformation/object-methods.js';
import objectShorthandsTransformation from './transformation/object-shorthands.js';
import noStrictTransformation from './transformation/no-strict.js';
import commonjsTransformation from './transformation/commonjs.js';

const tranformersMap = {
  classes: classTransformation,
  stringTemplates: templateStringTransformation,
  arrowFunctions: arrowFunctionTransformation,
  let: letTransformation,
  defaultArguments: defaultArgsTransformation,
  objectMethods: objectMethodsTransformation,
  objectShorthands: objectShorthandsTransformation,
  noStrict: noStrictTransformation,
  commonjs: commonjsTransformation,
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
      .pick(enabled => enabled)
      .map((enabled, key) => tranformersMap[key])
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
