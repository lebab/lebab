import recast from 'recast';
import fs from 'fs';
import coffee from 'coffee-script';

/**
 * This function reads a js file and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param file
 * @param options
 * @returns {Object}
 */
export function readFile(file, options) {

  if (typeof options.coffee === 'undefined') {
    options.coffee = /\.coffee$/.test(file);
  }

  return this.read(fs.readFileSync(file), options);

}

/**
 * This function reads a js string and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param js
 * @param options
 * @returns {Object}
 */
export function read(js, options) {
  if (options.coffee) {
    js = coffee.compile(js);
  }

  let ast = recast.parse(js).program;

  return ast;
}

export default {
  read: read,
  readFile: readFile
};
