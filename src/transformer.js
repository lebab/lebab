import astGenerator from './utils/ast-generator.js';
import codeGenerator from 'escodegen';
import fs from 'fs';

export default
class Transformer {

  constructor() {

  }

  readFile(filename) {
    this.ast = astGenerator.readFile(filename, {
      sync: true,
      ecmaVersion: 6
    });
  }

  read(string) {
    this.ast = astGenerator.read(string);
  }

  applyTransformation(transformation) {
    transformation(this.ast);
  }

  out() {
    return codeGenerator.generate(this.ast);
  }

  writeFile(filename) {
    fs.writeFileSync(filename, this.out());
  }

}