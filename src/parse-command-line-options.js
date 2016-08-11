import program from 'commander';
import pkg from '../package.json';
import fs from 'fs';
import path from 'path';

const transformsDocs = `
  Safe transforms:

    + arrow .......... callback to arrow function
    + let ............ var to let/const
    + arg-spread ..... use of apply() to spread operator
    + obj-method ..... function values in objects to methods
    + obj-shorthand .. {foo: foo} to {foo}
    + no-strict ...... remove "use strict" directives
    + commonjs ....... CommonJS module loading to import/export

  Unsafe transforms:

    + class .......... prototype assignments to class declaration
    + template ....... string concatenation to template string
    + default-param .. use of || to default parameters

  ES7 transforms:

    + exponent ....... Math.pow() to ** operator`;

program.usage('-t <transform> <file>');
program.description(`${pkg.description}\n${transformsDocs}`);
program.version(pkg.version);
program.option('-o, --out-file <file>', 'write output to a file');
program.option('--replace <dir>', `in-place transform all *.js files in a directory
                         <dir> can also be a single file or a glob pattern`);
program.option('-t, --transform <a,b,c>', 'one or more transformations to perform', v => v.split(','));

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
  const availableTransforms = {
    'class': true,
    'template': true,
    'arrow': true,
    'let': true,
    'default-param': true,
    'arg-spread': true,
    'obj-method': true,
    'obj-shorthand': true,
    'no-strict': true,
    'commonjs': true,
    'exponent': true,
    'multi-var': true,
  };

  transformNames.forEach(name => {
    if (!availableTransforms[name]) {
      throw `Unknown transform "${name}".`;
    }
  });
}
