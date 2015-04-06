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
  var ast;

  if (typeof options.coffee === 'undefined') {
    options.coffee = /\.coffee$/.test(file);
  }

  if (options.sync) {
    var js = fs.readFileSync(file);
    return read(js, options);
  } else {
    fs.readFile(function (js) {
      if (options.callback) {
        options.callback(read(js, options));
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

  if (options.coffee) {
    js = coffee.compile(js);
  }

  return acorn.parse(js, options);

}

export default {
  read: read,
  readFile: readFile
};
