var Transformer = require('./../lib/transformer');
var _ = require('lodash');

module.exports = function (program, file) {
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
  };

  // When --no-classes used, disable classes transformer
  if(! program.classes) {
    transformers.classes = false;
  }

  // When --transformers used turn off everything besides the specified tranformers
  if (program.transformers) {
    transformers = _.mapValues(transformers, _.constant(false));

    program.transformers.forEach(function (name) {
      if (!transformers.hasOwnProperty(name)) {
        console.error("Unknown transformer '" + name + "'.");
      }
      transformers[name] = true;
    });
  }

  var transformer = new Transformer({transformers: transformers});
  transformer.readFile(file[0]);
  transformer.applyTransformations();
  transformer.writeFile(program.outFile);

  console.log('The file "' + program.outFile + '" has been written.');
};
