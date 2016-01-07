import fs from 'fs';
import _ from 'lodash';
import recast from 'recast';
import astGenerator from './utils/ast-generator.js';

// Transformers
import classTransformation from './transformation/classes.js';
import templateStringTransformation from './transformation/template-string.js';
import arrowFunctionTransformation from './transformation/arrow-functions.js';
import letTransformation from './transformation/let.js';
import defaultArgsTransformation from './transformation/default-arguments.js';
import objectMethodsTransformation from './transformation/object-methods.js';

const tranformersMap = {
  classes: classTransformation,
  stringTemplates: templateStringTransformation,
  arrowFunctions: arrowFunctionTransformation,
  let: letTransformation,
  defaultArguments: defaultArgsTransformation,
  objectMethods: objectMethodsTransformation,
};

export default
class Transformer {

  /**
   * @constructor
   */
  constructor(options = {}) {

    this.ast = {};
    this.options = options;

    this.transformations = _(options.transformers)
      .pick(enabled => enabled)
      .map((enabled, key) => tranformersMap[key])
      .value();

  }

  /**
   * Prepare the abstract syntax tree for given file
   *
   * @param filename
   */
  readFile(filename) {

    this.ast = astGenerator.readFile(filename);

  }

  /**
   * Prepare an abstract syntax tree for given code in string
   *
   * @param string
   */
  read(string) {

    this.ast = astGenerator.read(string);

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

  /**
   * Writes the code in file
   *
   * @param filename
   */
  writeFile(filename) {

    fs.writeFileSync(filename, this.out());

  }

}
