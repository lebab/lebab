import fs from 'fs';
import merge from 'lodash/object/merge.js';
import codeGenerator from 'escodegen';
import astGenerator from './utils/ast-generator.js';

// Transformers
import classTransformation from './transformation/classes.js';
import templateStringTransformation from './transformation/template-string.js';
import arrowFunctionTransformation from './transformation/arrow-functions.js';

export default
class Transformer {

  /**
   * @constructor
   */
  constructor(options = {}) {

    this.ast = {};
    this.options = merge(this.constructor.defaultOptions, options);
    this.transformations = [];

    this.prepareTransformations();

  }

  /**
   * Prepare transformations array by give options
   */
  prepareTransformations() {

    let shouldTransform = (key) => {
      return typeof this.options.transformers[key] !== 'undefined' && this.options.transformers[key];
    };

    let doTransform = (key, transformation) => {
      if(shouldTransform(key)) {
        this.transformations.push(transformation);
      }
    };

    doTransform('classes', classTransformation);
    doTransform('stringTemplates', templateStringTransformation);
    doTransform('arrowFunctions', arrowFunctionTransformation);
  }

  /**
   * Prepare the abstract syntax tree for given file
   *
   * @param filename
   */
  readFile(filename) {

    this.ast = astGenerator.readFile(filename, {
      sync: true,
      ecmaVersion: 6
    });

  }

  /**
   * Prepare an abstract syntax tree for given code in string
   *
   * @param string
   */
  read(string) {

    this.ast = astGenerator.read(string, this.options);

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
    return codeGenerator.generate(this.ast, {comment: true});
  }

  /**
   * Writes the code on file
   *
   * @param filename
   * @param callback
   */
  writeFile(filename, callback) {

    const code = this.out();

    if(typeof callback === 'function') {
      fs.writeFile(filename, code, callback);
    } else {
      fs.writeFileSync(filename, code);
    }

  }

}

Transformer.defaultOptions = {
  transformers: {
    classes: true,
    stringTemplates: true,
    arrowFunctions: true
  }
};
