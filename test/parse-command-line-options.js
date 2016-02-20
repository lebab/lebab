var expect = require('chai').expect;
var commander = require('commander');
var parseCommandLineOptions = require('./../lib/parse-command-line-options.js');

function parse(argv) {
  return parseCommandLineOptions(['node', 'script.js'].concat(argv));
}

describe('Command Line Interface', function () {
  // Command line parser uses commander which has global state.
  // To be able to test different command-line combinations,
  // we'll need to reset the state between tests.
  beforeEach(function() {
    commander.outFile = undefined;
    commander.transformers = undefined;
    commander.disableTransformers = undefined;
    commander.module = undefined;
  });

  it('by default reads STDIN and writes to STDOUT', function() {
    var options = parse([]);
    expect(options.inFile).to.equal(undefined);
    expect(options.outFile).to.equal(undefined);
  });

  it('when existing <filename> given reads <filename> and writes to STDOUT', function() {
    var options = parse(['lib/io.js']);
    expect(options.inFile).to.equal('lib/io.js');
    expect(options.outFile).to.equal(undefined);
  });

  it('when not-existing <filename> given raises error', function() {
    expect(function() {
      parse(['missing.js']);
    }).to.throw('File missing.js does not exist.')
  });

  it('when more than one <filename> given raises error', function() {
    expect(function() {
      parse(['lib/io.js', 'lib/transformer.js']);
    }).to.throw('Only one input file allowed, but 2 given instead.')
  });

  it('when --out-file <filename> given writes <filename> and reads STDIN', function() {
    var options = parse(['--out-file', 'some/file.js']);
    expect(options.inFile).to.equal(undefined);
    expect(options.outFile).to.equal('some/file.js');
  });

  it('by default enables all transformers except CommonJS import/export', function() {
    var options = parse([]);
    expect(options.transformers).to.deep.equal({
      classes: true,
      stringTemplates: true,
      arrowFunctions: true,
      let: true,
      defaultArguments: true,
      objectMethods: true,
      objectShorthands: true,
      noStrict: true,
      importCommonjs: false,
      exportCommonjs: false,
    });
  });

  it('when --transformers=let,noStrict given, enables only these transformers', function() {
    var options = parse(['--transformers', 'let,noStrict']);
    expect(options.transformers).to.deep.equal({
      classes: false,
      stringTemplates: false,
      arrowFunctions: false,
      let: true,
      defaultArguments: false,
      objectMethods: false,
      objectShorthands: false,
      noStrict: true,
      importCommonjs: false,
      exportCommonjs: false,
    });
  });

  it('when --transformers=unknown given, raises error', function() {
    expect(function() {
      parse(['--transformers', 'unknown']);
    }).to.throw('Unknown transformer "unknown".');
  });

  it('when --disable-transformers=let,noStrict given, disables the specified transformers', function() {
    var options = parse(['--disable-transformers', 'let,noStrict']);
    expect(options.transformers).to.deep.equal({
      classes: true,
      stringTemplates: true,
      arrowFunctions: true,
      let: false,
      defaultArguments: true,
      objectMethods: true,
      objectShorthands: true,
      noStrict: false,
      importCommonjs: false,
      exportCommonjs: false,
    });
  });

  it('when --disable-transformers=unknown given, raises error', function() {
    expect(function() {
      parse(['--disable-transformers', 'unknown']);
    }).to.throw('Unknown transformer "unknown".');
  });

  it('when --transforms and --disable-transformers used together, raises error', function() {
    expect(function() {
      parse(['--transformers', 'let', '--disable-transformers', 'let']);
    }).to.throw('Options --transformers and --disable-transformers can not be used together.');
  });

  it('when --module=commonjs given, enables CommonJS import/export transformers', function() {
    var options = parse(['--module', 'commonjs']);
    expect(options.transformers).to.deep.equal({
      classes: true,
      stringTemplates: true,
      arrowFunctions: true,
      let: true,
      defaultArguments: true,
      objectMethods: true,
      objectShorthands: true,
      noStrict: true,
      importCommonjs: true,
      exportCommonjs: true,
    });
  });

  it('when --module=unknown given, raises error', function() {
    expect(function() {
      parse(['--module', 'unknown']);
    }).to.throw('Unsupported module system "unknown".');
  });

});
