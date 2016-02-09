#!/usr/bin/env node
require('babel/polyfill');
var parseCommandLineOptions = require("../lib/parse-command-line-options");
var transformFile = require('./file');
var options;

try {
  options = parseCommandLineOptions(process.argv);
}
catch (error) {
  console.error(error);
  process.exit(2);
}

transformFile(options);
