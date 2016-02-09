#!/usr/bin/env node
require('babel/polyfill');
var parseCommandLineOptions = require("../lib/parse-command-line-options");
var Transformer = require('./../lib/transformer');
var options;

try {
  options = parseCommandLineOptions(process.argv);
}
catch (error) {
  console.error(error);
  process.exit(2);
}

var transformer = new Transformer({transformers: options.transformers});
transformer.readFile(options.inFile);
transformer.applyTransformations();
transformer.writeFile(options.outFile);

console.log('The file "' + options.outFile + '" has been written.');
