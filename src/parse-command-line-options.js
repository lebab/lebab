var program = require('commander');
var pkg = require('../package.json');
var fs = require('fs');
var _ = require('lodash');

program.usage('[options] <file>');
program.description(`${pkg.description}

  Available transforms:

    + classes
    + stringTemplates
    + arrowFunctions
    + let
    + defaultArguments
    + objectMethods
    + objectShorthands
    + noStrict
    + commonjs`);
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
    transformers: getTransformers(),
  };
}

function getInputFile() {
  if (program.args.length > 1) {
    throw 'Only one input file allowed, but ' + program.args.length + ' given instead.';
  }
  if (program.args[0] && !fs.existsSync(program.args[0])) {
    throw 'File ' + program.args[0] + ' does not exist.';
  }
  return program.args[0];
}

function getTransformers() {
  if (program.enable && program.disable) {
    throw 'Options --enable and --disable can not be used together.';
  }

  // All enabled by default
  var transformers = {
    classes: true,
    stringTemplates: true,
    arrowFunctions: true,
    let: true,
    defaultArguments: true,
    objectMethods: true,
    objectShorthands: true,
    noStrict: true,
    commonjs: true,
  };

  // When --enable used turn off everything besides the specified tranformers
  if (program.enable) {
    transformers = _.mapValues(transformers, _.constant(false));

    setTransformersEnabled(transformers, program.enable, true);
  }

  // When --disable used, disable the specific transformers
  if (program.disable) {
    setTransformersEnabled(transformers, program.disable, false);
  }

  return transformers;
}

function setTransformersEnabled(transformers, names, enabled) {
  names.forEach(function (name) {
    if (!transformers.hasOwnProperty(name)) {
      throw 'Unknown transformer "' + name + '".';
    }
    transformers[name] = enabled;
  });
}
