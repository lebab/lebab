import acorn from 'acorn';
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

  if (options.sync) {
    let js = fs.readFileSync(file);
    return this.read(js, options);
  } else {
    fs.readFile(file, (js) => {
      if (options.callback) {
        options.callback(this.read(js, options));
      }
    });
  }

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

  return acorn.parse(js, options);

}

export default {
  read: read,
  readFile: readFile
};
