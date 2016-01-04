var Transformer = require('./../lib/transformer');
var _ = require('lodash');

module.exports = function (program, file) {
  // Enable all transformers by default
  var options = {
    transformers: {
      classes: true,
      stringTemplates: true,
      arrowFunctions: true,
      let: true,
      defaultArguments: true,
      objectMethods: true
    }
  };

  // When --no-classes used, disable classes transformer
  if(! program.classes) {
    options.transformers.classes = false;
  }

  // When --transformers used turn off everything besides the specified tranformers
  if (program.transformers) {
    options.transformers = _.mapValues(options.transformers, _.constant(false));

    program.transformers.forEach(function (name) {
      if (!options.transformers.hasOwnProperty(name)) {
        console.error("Unknown transformer '" + name + "'.");
      }
      options.transformers[name] = true;
    });
  }

  var transformer = new Transformer(options);
  transformer.readFile(file[0]);
  transformer.applyTransformations();
  transformer.writeFile(program.outFile);

  console.log('The file "' + program.outFile + '" has been written.');
};
