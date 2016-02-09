#!/usr/bin/env node
require('babel/polyfill');
var parseCommandLineOptions = require("../lib/parse-command-line-options");
var Transformer = require('./../lib/transformer');
var io = require('./../lib/io');
var options;

try {
  options = parseCommandLineOptions(process.argv);
}
catch (error) {
  console.error(error);
  process.exit(2);
}

var transformer = new Transformer({transformers: options.transformers});
transformer.read(io.read(options.inFile));
transformer.applyTransformations();
io.write(options.outFile, transformer.out());

console.log('The file "' + options.outFile + '" has been written.');
