var program = require('commander');
var pkg = require('../package.json');
var fs = require('fs');
var _ = require('lodash');

program.usage('[options] <file>');
program.description(pkg.description);
program.version(pkg.version);
program.option('-o, --out-file <out>', 'Compile into a single file');
program.option('--enable <a,b,c>', 'Enable only specified transforms', v => v.split(','));
program.option('--disable <a,b,c>', 'Disable specified transforms', v => v.split(','));
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
    importCommonjs: false,
    exportCommonjs: false,
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

function setTransformersEnabled(transformers, names, enabled) {
  names.forEach(function (name) {
    if (!transformers.hasOwnProperty(name)) {
      throw 'Unknown transformer "' + name + '".';
    }
    transformers[name] = enabled;
  });
}
