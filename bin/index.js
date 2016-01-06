#!/usr/bin/env node
require('babel/polyfill');
var program = require('commander');
var fs = require("fs");
var each = require("lodash/collection/each");
var keys = require("lodash/object/keys");
var pkg = require("../package.json");

function list(val) {
  return val.split(',');
}

program.option("-o, --out-file [out]", "Compile into a single file");
program.option("--no-classes", "Don't convert function/prototypes into classes");
program.option("-t, --transformers [a,b,c]", "Perform only specified transforms", list);
program.description(pkg.description);
program.version(pkg.version);
program.usage("[options] <file>");
program.parse(process.argv);

var errors = [],
  filenames = program.args;

if (filenames.length === 0) {
  errors.push('File name is required.');
}
each(filenames, function (filename) {
  if (!fs.existsSync(filename)) {
    errors.push(filename + ' doesn\'t exist');
  }
});

if (!program.outFile || program.outFile === true) {
  program.outFile = 'output.js';
}

if (errors.length) {
  console.error(errors.join(". "));
  process.exit(2);
} else {
  var fn = require('./file');
  fn(program, filenames);
}
