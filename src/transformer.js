import astGenerator from './utils/ast-generator.js';
import codeGenerator from 'escodegen';
import fs from 'fs';

export default
class Transformer {

  /**
   * @constructor
   */
  constructor() {
    this.ast = {};
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
  read(string, options = {}) {
    this.ast = astGenerator.read(string, options);
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
   * Returns the code string
   *
   * @returns {Object}
   */
  out() {
    return codeGenerator.generate(this.ast);
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
