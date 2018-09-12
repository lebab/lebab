import {Command} from 'commander';
import pkg from '../package.json';
import fs from 'fs';
import path from 'path';

const transformsDocs = `
  Safe transforms:

    + arrow .......... callback to arrow function
    + arrow-return ... drop return statements in arrow functions
    + for-of ......... for loop to for-of loop
    + for-each ....... for loop to Array.forEach()
    + arg-rest ....... use of arguments to function(...args)
    + arg-spread ..... use of apply() to spread operator
    + obj-method ..... function values in objects to methods
    + obj-shorthand .. {foo: foo} to {foo}
    + no-strict ...... remove "use strict" directives
    + exponent ....... Math.pow() to ** operator (ES7)
    + multi-var ...... single var x,y; declaration to var x; var y; (refactor)

  Unsafe transforms:

    + let ............ var to let/const
    + class .......... prototype assignments to class declaration
    + commonjs ....... CommonJS module loading to import/export
    + template ....... string concatenation to template string
    + default-param .. use of || to default parameters
    + destruct-param . use destructuring for objects in function parameters
    + includes ....... indexOf() != -1 to includes() (ES7)
`;

/**
 * Command line options parser.
 */
export default class OptionParser {
  constructor() {
    this.program = new Command();
    this.program.usage('-t <transform> <file>');
    this.program.description(`${pkg.description}\n${transformsDocs}`);
    this.program.version(pkg.version);
    this.program.option('-o, --out-file <file>', 'write output to a file');
    this.program.option('--replace <dir>', `in-place transform all *.js files in a directory
                             <dir> can also be a single file or a glob pattern`);
    this.program.option('-t, --transform <a,b,c>', 'one or more transformations to perform', v => v.split(','));
  }

  /**
   * Parses and validates command line options from argv.
   *
   * - On success returns object with options.
   * - On failure throws exceptions with error message to be shown to user.
   *
   * @param {String[]} argv Raw command line arguments
   * @return {Object} options object
   */
  parse(argv) {
    this.program.parse(argv);

    return {
      inFile: this.getInputFile(),
      outFile: this.program.outFile,
      replace: this.getReplace(),
      transforms: this.getTransforms(),
    };
  }

  getInputFile() {
    if (this.program.args.length > 1) {
      throw `Only one input file allowed, but ${this.program.args.length} given instead.`;
    }
    if (this.program.args[0] && !fs.existsSync(this.program.args[0])) {
      throw `File ${this.program.args[0]} does not exist.`;
    }
    return this.program.args[0];
  }

  getReplace() {
    if (!this.program.replace) {
      return undefined;
    }
    if (this.program.outFile) {
      throw 'The --replace and --out-file options cannot be used together.';
    }
    if (this.program.args[0]) {
      throw 'The --replace and plain input file options cannot be used together.\n' +
        'Did you forget to quote the --replace parameter?';
    }
    if (fs.existsSync(this.program.replace) && fs.statSync(this.program.replace).isDirectory()) {
      return path.join(this.program.replace, '/**/*.js');
    }
    return this.program.replace;
  }

  getTransforms() {
    if (!this.program.transform || this.program.transform.length === 0) {
      throw `No transforms specified :(

  Use --transform option to pick one of the following:
  ${transformsDocs}`;
    }

    return this.program.transform;
  }
}
