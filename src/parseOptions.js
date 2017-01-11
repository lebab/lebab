import program from 'commander';
import pkg from '../package.json';
import fs from 'fs';
import path from 'path';
import builtinTransforms from './builtinTransforms';

const transformsDocs = `
  Safe transforms:

    + arrow .......... callback to arrow function
    + for-of ......... for loop to for-of loop
    + for-each ....... for loop to Array.forEach()
    + arg-rest ....... use of arguments to function(...args)
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
    + destruct-param . use destructuring for objects in function parameters
    + includes ....... indexOf() != -1 to includes() (ES7)
`;

program.usage('-t <transform> <file>');
program.description(`${pkg.description}\n${transformsDocs}`);
program.version(pkg.version);
program.option('-o, --out-file <file>', 'write output to a file');
program.option('--replace <dir>', `in-place transform all *.js files in a directory
                         <dir> can also be a single file or a glob pattern`);
program.option('-t, --transform <a,b,c>', 'one or more transformations to perform', v => v.split(','));
program.option('-s, --replaceSaveOriginal <dir>', `in-place transform all *.js files in a directory
                         <dir> can also be a single file or a glob pattern
                         makes a copy of each file for comparison prefixed with _original
                         automatically skips node_modules`);
program.option('-d, --deleteOriginals <dir>', 'removes all files prefixed with _original');

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
    replaceSaveOriginal: getReplaceSaveOriginal(),
    deleteOriginals: getDeleteOriginals(),
    transforms: getTransforms(),
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

function getReplaceSaveOriginal() {
  if (!program.replaceSaveOriginal) {
    return undefined;
  }
  if (program.outFile) {
    throw 'The --replaceSaveOriginal and --out-file options cannot be used together.';
  }
  if (program.args[0]) {
    throw 'The --replaceSaveOriginal and plain input file options cannot be used together.\n' +
      'Did you forget to quote the --replaceSaveOriginal parameter?';
  }
  if (fs.existsSync(program.replaceSaveOriginal) && fs.statSync(program.replaceSaveOriginal).isDirectory()) {
    return path.join(program.replaceSaveOriginal, '/**/*.js');
  }
  return program.replaceSaveOriginal;
}

function getDeleteOriginals() {
  if (!program.deleteOriginals) {
    return undefined;
  }
  if (program.outFile) {
    throw 'The --deleteOriginals and --out-file options cannot be used together.';
  }
  if (program.args[0]) {
    throw 'The --deleteOriginals and plain input file options cannot be used together.\n' +
      'Did you forget to quote the --deleteOriginals parameter?';
  }
  const dir = path.resolve(program.deleteOriginals).replace('**', '');
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw 'The --deleteOriginals options must be used on a directory.';
  }
  return program.deleteOriginals;
}


function getTransforms() {
  if (program.deleteOriginals) {
    return;
  }
  if (!program.transform || program.transform.length === 0) {
    throw `No transforms specified :(

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
