#!/usr/bin/env node
var program = require('commander');
var fs = require("fs");
var each = require("lodash/collection/each");
var keys = require("lodash/object/keys");
var pkg = require("../package.json");

program.option("-o, --out-file [out]", "Compile into a single file");
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

if (!program.outFile) {
  program.outFile = 'output.js';
}

if (errors.length) {
  console.error(errors.join(". "));
  process.exit(2);
} else {
  var fn = require('./file');
  fn(program, filenames);
}

