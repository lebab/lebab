import recast from 'recast';
import fs from 'fs';
import coffee from 'coffee-script';

/**
 * This function reads a js file and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param file
 * @returns {Object}
 */
export function readFile(file) {

  let code = fs.readFileSync(file);

  let js = /\.coffee$/.test(file) ? coffee.compile(code.toString()) : code;

  return this.read(js);

}

/**
 * This function reads a js string and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param js
 * @returns {Object}
 */
export function read(js) {

  return recast.parse(js).program;

}

export default {
  read: read,
  readFile: readFile
};
