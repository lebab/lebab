import {expect} from 'chai';
import commander from 'commander';
import parseCommandLineOptions from './../lib/parse-command-line-options';

function parse(argv) {
  return parseCommandLineOptions(['node', 'script.js'].concat(argv));
}

describe('Command Line Interface', () => {
  // Command line parser uses commander which has global state.
  // To be able to test different command-line combinations,
  // we'll need to reset the state between tests.
  beforeEach(() => {
    commander.outFile = undefined;
    commander.transform = undefined;
  });

  it('when no transforms given, throws error', () => {
    expect(() => {
      parse([]);
    }).to.throw('No transforms specifed :(');
  });

  it('when single transforms given, enables it', () => {
    const options = parse(['-t', 'class']);
    expect(options.transforms).to.deep.equal({
      'class': true,
      'template': false,
      'arrow': false,
      'let': false,
      'default-param': false,
      'arg-spread': false,
      'obj-method': false,
      'obj-shorthand': false,
      'no-strict': false,
      'commonjs': false,
    });
  });

  it('when --transfrom=let,no-strict,commonjs given, enables only these transforms', () => {
    const options = parse(['--transform', 'let,no-strict,commonjs']);
    expect(options.transforms).to.deep.equal({
      'class': false,
      'template': false,
      'arrow': false,
      'let': true,
      'default-param': false,
      'arg-spread': false,
      'obj-method': false,
      'obj-shorthand': false,
      'no-strict': true,
      'commonjs': true,
    });
  });

  it('when --transform=unknown given, raises error', () => {
    expect(() => {
      parse(['--transform', 'unknown']);
    }).to.throw('Unknown transform "unknown".');
  });

  it('by default reads STDIN and writes to STDOUT', () => {
    const options = parse(['-t', 'class']);
    expect(options.inFile).to.equal(undefined);
    expect(options.outFile).to.equal(undefined);
  });

  it('when existing <filename> given reads <filename> and writes to STDOUT', () => {
    const options = parse(['-t', 'class', 'lib/io.js']);
    expect(options.inFile).to.equal('lib/io.js');
    expect(options.outFile).to.equal(undefined);
  });

  it('when not-existing <filename> given raises error', () => {
    expect(() => {
      parse(['-t', 'class', 'missing.js']);
    }).to.throw('File missing.js does not exist.');
  });

  it('when more than one <filename> given raises error', () => {
    expect(() => {
      parse(['-t', 'class', 'lib/io.js', 'lib/transformer.js']);
    }).to.throw('Only one input file allowed, but 2 given instead.');
  });

  it('when --out-file <filename> given writes <filename> and reads STDIN', () => {
    const options = parse(['-t', 'class', '--out-file', 'some/file.js']);
    expect(options.inFile).to.equal(undefined);
    expect(options.outFile).to.equal('some/file.js');
  });
});
