import fs from 'fs';
import _ from 'lodash';
import recast from 'recast';
import formatter from 'esformatter';
import astGenerator from './utils/ast-generator.js';

// Transformers
import classTransformation from './transformation/classes.js';
import templateStringTransformation from './transformation/template-string.js';
import arrowFunctionTransformation from './transformation/arrow-functions.js';
import letTransformation from './transformation/let.js';
import defaultArgsTransformation from './transformation/default-arguments.js';
import objectMethodsTransformation from './transformation/object-methods.js';
import objectShorthandsTransformation from './transformation/object-shorthands.js';
import noStrictTransformation from './transformation/no-strict.js';

const tranformersMap = {
  classes: classTransformation,
  stringTemplates: templateStringTransformation,
  arrowFunctions: arrowFunctionTransformation,
  let: letTransformation,
  defaultArguments: defaultArgsTransformation,
  objectMethods: objectMethodsTransformation,
  objectShorthands: objectShorthandsTransformation,
  noStrict: noStrictTransformation,
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
    let result = recast.print(this.ast).code;

    if(this.options.formatter) {
      result = formatter.format(result, this.options.formatter);
    }

    return result;
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
  /**
   *  Outputs the Result the STDOUT
   * @param callback 
   */
  
  writeToStdout(callback){
      var code  = this.out();
      var err = null;
      if(process.stdout.isTTY){
        process.stdout.write(code + '\n');
      }
      else {
        err = 'Undefined TTY Context';
      }
      if(typeof callback === 'function'){
        return callback(err);
      }
    }

}
