var
  classTransformation = require('./../lib/transformation/classes'),
  Transformer = require('./../lib/transformer'),
  transformer = new Transformer();

module.exports = function (program, file) {
  transformer.readFile('sample.js');
  transformer.applyTransformation(classTransformation);
  transformer.writeFile(program.outFile);
};
