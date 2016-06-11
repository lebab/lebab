#!/usr/bin/env node
var parseCommandLineOptions = require('../lib/parse-command-line-options');
var Transformer = require('./../lib/transformer');
var io = require('./../lib/io');
var options;

try {
  options = parseCommandLineOptions(process.argv);
}
catch (error) {
  console.error(error); // eslint-disable-line no-console
  process.exit(2);
}

var transformer = new Transformer(options.transforms);
io.write(options.outFile, transformer.run(io.read(options.inFile)).code);
