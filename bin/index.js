#!/usr/bin/env node
require('babel/polyfill');
var program = require('commander');
var fs = require("fs");
var pkg = require("../package.json");
var transformFile = require('./file');

function list(val) {
  return val.split(',');
}

function exitWithError(msg) {
  console.error(msg);
  process.exit(2);
}

program.option("-o, --out-file [out]", "Compile into a single file");
program.option("--no-classes", "Don't convert function/prototypes into classes");
program.option("-t, --transformers [a,b,c]", "Perform only specified transforms", list);
program.option("--module [commonjs]", "Transform CommonJS module syntax");
program.description(pkg.description);
program.version(pkg.version);
program.usage("[options] <file>");
program.parse(process.argv);

if (program.args.length > 1) {
  exitWithError('Only one input file allowed, but ' + program.args.length + ' given instead.');
}
var filename = program.args[0];

if (!filename) {
  exitWithError('Input file name is required.');
}
if (!fs.existsSync(filename)) {
  exitWithError('File ' + filename + ' does not exist.');
}

if (!program.outFile || program.outFile === true) {
  program.outFile = 'output.js';
}

transformFile(program, filename);
