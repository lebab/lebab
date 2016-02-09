var Transformer = require('./../lib/transformer');

module.exports = function (options) {
  var transformer = new Transformer({transformers: options.transformers});
  transformer.readFile(options.inFile);
  transformer.applyTransformations();
  transformer.writeFile(options.outFile);

  console.log('The file "' + options.outFile + '" has been written.');
};
