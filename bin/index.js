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
var result = transformer.run(io.read(options.inFile));

// Log warnings if there are any
result.warnings.forEach(function(warning) { // eslint-disable-line
  console.error(  // eslint-disable-line
    warning.line +  // eslint-disable-line
    ':  warning  ' +
    warning.msg +
    '  (' + warning.type + ')'
  );
});

io.write(options.outFile, result.code);
