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
import importCommonjsTransformation from './transformation/import-commonjs.js';
import exportCommonjsTransformation from './transformation/export-commonjs.js';

const tranformersMap = {
  classes: classTransformation,
  stringTemplates: templateStringTransformation,
  arrowFunctions: arrowFunctionTransformation,
  let: letTransformation,
  defaultArguments: defaultArgsTransformation,
  objectMethods: objectMethodsTransformation,
  objectShorthands: objectShorthandsTransformation,
  noStrict: noStrictTransformation,
  importCommonjs: importCommonjsTransformation,
  exportCommonjs: exportCommonjsTransformation,
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
    const ast = recast.parse(code).program;

    this.transformers.forEach(transformer => {
      transformer(ast);
    });

    return recast.print(ast).code;
  }
}
