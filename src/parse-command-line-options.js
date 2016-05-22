import program from 'commander';
import pkg from '../package.json';
import fs from 'fs';
import _ from 'lodash';

program.usage('[options] <file>');
program.description(`${pkg.description}

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
    + default-param .. use of || to default parameters`);
program.version(pkg.version);
program.option('-o, --out-file <out>', 'compile into a single file');
program.option('--enable <a,b,c>', 'enable only specified transforms', v => v.split(','));
program.option('--disable <a,b,c>', 'disable specified transforms', v => v.split(','));

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

function getTransforms() {
  if (program.enable && program.disable) {
    throw 'Options --enable and --disable can not be used together.';
  }

  // All enabled by default
  let transforms = {
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
  };

  // When --enable used turn off everything besides the specified tranformers
  if (program.enable) {
    transforms = _.mapValues(transforms, _.constant(false));

    setTransformsEnabled(transforms, program.enable, true);
  }

  // When --disable used, disable the specific transforms
  if (program.disable) {
    setTransformsEnabled(transforms, program.disable, false);
  }

  return transforms;
}

function setTransformsEnabled(transforms, names, enabled) {
  names.forEach(name => {
    if (!transforms.hasOwnProperty(name)) {
      throw `Unknown transform "${name}".`;
    }
    transforms[name] = enabled;
  });
}
