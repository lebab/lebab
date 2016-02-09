var Transformer = require('./../lib/transformer');
var _ = require('lodash');

module.exports = function (options) {
  // Enable all transformers by default
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
  if (!options.classes) {
    transformers.classes = false;
  }

  // When --transformers used turn off everything besides the specified tranformers
  if (options.transformers) {
    transformers = _.mapValues(transformers, _.constant(false));

    options.transformers.forEach(function (name) {
      if (!transformers.hasOwnProperty(name)) {
        console.error("Unknown transformer '" + name + "'.");
      }
      transformers[name] = true;
    });
  }

  // When --module=commonjs used, enable CommonJS Transformers
  if (options.module === 'commonjs') {
    transformers.importCommonjs = true;
    transformers.exportCommonjs = true;
  }
  else if (options.module) {
    console.error("Unsupported module system '" + options.module + "'.");
  }

  var transformer = new Transformer({transformers: transformers});
  transformer.readFile(options.inFile);
  transformer.applyTransformations();
  transformer.writeFile(options.outFile);

  console.log('The file "' + options.outFile + '" has been written.');
};
