var
  classTransformation = require('./../lib/transformation/classes'),
  Transformer = require('./../lib/transformer'),
  transformer = new Transformer();

module.exports = function (program, file) {
  transformer.readFile(file[0]);
  transformer.applyTransformation(classTransformation);
  transformer.writeFile(program.outFile);

  console.log('The file "' + program.outFile + '" has been written.');
};
