var Transformer = require('./../lib/transformer');

module.exports = function (program, file) {
  var options = {
    transformers: {}
  };

  if(! program.classes) {
    options.transformers.classes = false;
  }

  var transformer = new Transformer(options);
  transformer.readFile(file[0]);
  transformer.applyTransformations();
  transformer.writeFile(program.outFile);

  console.log('The file "' + program.outFile + '" has been written.');
};
