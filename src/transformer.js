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

export default
class Transformer {
  /**
   * @param {Object} transformers List of transformers to enable
   */
  constructor(transformers={}) {
    this.ast = {};

    this.transformations = _(transformers)
      .pick(enabled => enabled)
      .map((enabled, key) => tranformersMap[key])
      .value();
  }

  /**
   * Prepare an abstract syntax tree for given code in string
   *
   * @param string
   */
  read(string) {
    this.ast = recast.parse(string).program;
  }

  /**
   * Apply a transformation on the AST
   *
   * @param transformation
   */
  applyTransformation(transformation) {
    transformation(this.ast);
  }

  /**
   * Apply All transformations
   */
  applyTransformations() {
    for (let i = 0; i < this.transformations.length; i++) {
      let transformation = this.transformations[i];
      this.applyTransformation(transformation);
    }
  }

  /**
   * Returns the code string
   *
   * @returns {Object}
   */
  out() {
    return recast.print(this.ast).code;
  }
}
