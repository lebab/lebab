import program from 'commander';
import pkg from '../package.json';
import fs from 'fs';
import path from 'path';
import builtinTransforms from './builtinTransforms';

const transformsDocs = `
  Safe transforms:

    + arrow .......... callback to arrow function
    + for-of ......... for loop to for-of loop
    + arg-spread ..... use of apply() to spread operator
    + obj-method ..... function values in objects to methods
    + obj-shorthand .. {foo: foo} to {foo}
    + no-strict ...... remove "use strict" directives
    + commonjs ....... CommonJS module loading to import/export
    + exponent ....... Math.pow() to ** operator (ES7)
    + multi-var ...... single var x,y; declaration to var x; var y; (refactor)

  Unsafe transforms:

    + let ............ var to let/const
    + class .......... prototype assignments to class declaration
    + template ....... string concatenation to template string
    + default-param .. use of || to default parameters
    + includes ....... indexOf() != -1 to includes() (ES7)
`;

program.usage('-t <transform> <file>');
program.description(`${pkg.description}\n${transformsDocs}`);
program.version(pkg.version);
program.option('-o, --out-file <file>', 'write output to a file');
program.option('--replace <dir>', `in-place transform all *.js files in a directory
                         <dir> can also be a single file or a glob pattern`);
program.option('-t, --transform <a,b,c>', 'one or more transformations to perform', v => v.split(','));
program.option('--eol <cr|lf|crlf|auto>');

/**
 * Parses and validates command line options from argv.
 *
 * - On success returns object with options.
 * - On failure throws exceptions with error message to be shown to user.
 *
 * @param {String[]} argv Raw command line arguments
 * @return {Object} options object
 */
export default function parseCommandLineOptions(argv) {
  program.parse(argv);
  return {
    inFile: getInputFile(),
    outFile: program.outFile,
    replace: getReplace(),
    transforms: getTransforms(),
    eol: getEol(),
  };
}

function getInputFile() {
  if (program.args.length > 1) {
    throw `Only one input file allowed, but ${program.args.length} given instead.`;
  }
  if (program.args[0] && !fs.existsSync(program.args[0])) {
    throw `File ${program.args[0]} does not exist.`;
  }
  return program.args[0];
}

function getReplace() {
  if (!program.replace) {
    return undefined;
  }
  if (program.outFile) {
    throw 'The --replace and --out-file options cannot be used together.';
  }
  if (program.args[0]) {
    throw 'The --replace and plain input file options cannot be used together.\n' +
      'Did you forget to quote the --replace parameter?';
  }
  if (fs.existsSync(program.replace) && fs.statSync(program.replace).isDirectory()) {
    return path.join(program.replace, '/**/*.js');
  }
  return program.replace;
}

function getTransforms() {
  if (!program.transform || program.transform.length === 0) {
    throw `No transforms specifed :(

Use --transform option to pick one of the following:
${transformsDocs}`;
  }

  // Ensure only valid transform names are used
  validateTransforms(program.transform);

  return program.transform;
}

function validateTransforms(transformNames) {
  transformNames.forEach(name => {
    if (!builtinTransforms.get(name)) {
      throw `Unknown transform "${name}".`;
    }
  });
}

function getEol() {
  if (!program.eol) {
    return;
  }

  switch (program.eol.toLowerCase()) {
  case 'cr':
    return '\r';

  case 'lf':
    return '\n';

  case 'crlf':
    return '\r\n';

  default:
    throw 'Invalid line terminator. Expected cr, lf or crlf';
  }
}
