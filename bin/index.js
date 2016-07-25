#!/usr/bin/env node
var glob = require('glob');
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

if (options.dir) {
  // Transform all files in a directory
  glob.sync(options.dir + '/**/*.js').forEach(function(file) { // eslint-disable-line
    transformFile(file, file);
  });
}
else {
  // Transform just a single file
  transformFile(options.inFile, options.outFile);
}

function transformFile(inFile, outFile) {
  var result = transformer.run(io.read(inFile));

  // Log warnings if there are any
  if (result.warnings.length > 0 && inFile) {
    console.error(`${inFile}:`); // eslint-disable-line no-console
  }
  result.warnings.forEach(function(warning) { // eslint-disable-line
    console.error(  // eslint-disable-line
      warning.line +  // eslint-disable-line
      ':  warning  ' +
      warning.msg +
      '  (' + warning.type + ')'
    );
  });

  io.write(outFile, result.code);
}
