import program from 'commander';
import pkg from '../package.json';
import fs from 'fs';

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
program.option('--dir <dir>', 'in-place transform all *.js files of a directory');
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
    dir: getDir(),
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

function getDir() {
  if (!program.dir) {
    return undefined;
  }
  if (program.outFile) {
    throw 'The --dir and --out-file options cannot be used together.';
  }
  if (program.args[0]) {
    throw 'The --dir and plain input file options cannot be used together.';
  }
  if (!fs.existsSync(program.dir)) {
    throw `Directory ${program.dir} does not exist.`;
  }
  return program.dir;
}

function getTransforms() {
  if (!program.transform || program.transform.length === 0) {
    throw `No transforms specifed :(

Use --transform option to pick one of the following:
${transformsDocs}`;
  }

  // All disabled by default
  const transforms = {
    'class': false,
    'template': false,
    'arrow': false,
    'let': false,
    'default-param': false,
    'arg-spread': false,
    'obj-method': false,
    'obj-shorthand': false,
    'no-strict': false,
    'commonjs': false,
    'exponent': false,
  };

  // When --transform used, enable the specific transforms
  setTransformsEnabled(transforms, program.transform);

  return transforms;
}

function setTransformsEnabled(transforms, names) {
  names.forEach(name => {
    if (!transforms.hasOwnProperty(name)) {
      throw `Unknown transform "${name}".`;
    }
    transforms[name] = true;
  });
}
