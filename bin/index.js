#!/usr/bin/env node
var Cli = require('./../lib/Cli').default; // eslint-disable-line no-var

new Cli(process.argv).run();
