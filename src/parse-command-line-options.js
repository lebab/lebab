var program = require('commander');
var pkg = require('../package.json');
var fs = require('fs');
var _ = require('lodash');

program.usage('[options] <file>');
program.description(pkg.description);
program.version(pkg.version);
program.option('-o, --out-file <out>', 'Compile into a single file');
program.option('--no-classes', 'Don\'t convert function/prototypes into classes');
program.option('-t, --transformers <a,b,c>', 'Perform only specified transforms', v => v.split(','));
program.option('--module <commonjs>', 'Transform CommonJS module syntax');

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
    outFile: getOutputFile(),
    transformers: getTransformers(),
  };
}

function getInputFile() {
  if (program.args.length > 1) {
    throw 'Only one input file allowed, but ' + program.args.length + ' given instead.';
  }
  if (program.args.length === 0) {
    throw 'Input file name is required.';
  }
  if (!fs.existsSync(program.args[0])) {
    throw 'File ' + program.args[0] + ' does not exist.';
  }
  return program.args[0];
}

function getOutputFile() {
  if (!program.outFile) {
    return 'output.js';
  }
  else {
    return program.outFile;
  }
}

function getTransformers() {
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
    importCommonjs: false,
    exportCommonjs: false,
  };

  // When --no-classes used, disable classes transformer
  if (!program.classes) {
    transformers.classes = false;
  }

  // When --transformers used turn off everything besides the specified tranformers
  if (program.transformers) {
    transformers = _.mapValues(transformers, _.constant(false));

    program.transformers.forEach(function (name) {
      if (!transformers.hasOwnProperty(name)) {
        throw 'Unknown transformer "' + name + '".';
      }
      transformers[name] = true;
    });
  }

  // When --module=commonjs used, enable CommonJS Transformers
  if (program.module === 'commonjs') {
    transformers.importCommonjs = true;
    transformers.exportCommonjs = true;
  }
  else if (program.module) {
    throw 'Unsupported module system "' + program.module + '".';
  }

  return transformers;
}
