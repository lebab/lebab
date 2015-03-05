import acorn from 'acorn';
import fs from 'fs';

/**
 * This function reads a js file and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param file
 * @param options
 * @returns {Object}
 */
export function readFile(file, options) {
  var ast;

  if (options.sync) {
    var js = fs.readFileSync(file);
    ast = acorn.parse(js, options);
    return ast;
  } else {
    fs.readFile(function (js) {
      ast = acorn.parse(js, options);

      if (options.callback) {
        options.callback(ast);
      }
    });
  }

}

/**
 * This function reads a js string and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param js
 * @returns {Object}
 */
export function read(js, options) {

  return acorn(js, options);

}