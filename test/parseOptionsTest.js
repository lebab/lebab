import {expect} from 'chai';
import commander from 'commander';
import parseOptions from './../src/parseOptions';

function parse(argv) {
  return parseOptions(['node', 'script.js'].concat(argv));
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
    expect(options.transforms).to.deep.equal([
      'class',
    ]);
  });

  it('when --transfrom=let,no-strict,commonjs given, enables only these transforms', () => {
    const options = parse(['--transform', 'let,no-strict,commonjs']);
    expect(options.transforms).to.deep.equal([
      'let',
      'no-strict',
      'commonjs',
    ]);
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
    expect(options.replace).to.equal(undefined);
  });

  it('when existing <filename> given reads <filename> and writes to STDOUT', () => {
    const options = parse(['-t', 'class', 'lib/io.js']);
    expect(options.inFile).to.equal('lib/io.js');
    expect(options.outFile).to.equal(undefined);
    expect(options.replace).to.equal(undefined);
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
    expect(options.replace).to.equal(undefined);
  });

  it('when --replace <dirname> given transforms all files in glob pattern', () => {
    const options = parse(['-t', 'class', '--replace', '*.js']);
    expect(options.inFile).to.equal(undefined);
    expect(options.outFile).to.equal(undefined);
    expect(options.replace).to.equal('*.js');
  });

  it('when --replace used together with input file, raises error', () => {
    expect(() => {
      parse(['-t', 'class', '--replace', 'lib/', 'lib/io.js']);
    }).to.throw('The --replace and plain input file options cannot be used together.');
  });

  it('when --replace used together with outout file, raises error', () => {
    expect(() => {
      parse(['-t', 'class', '--replace', 'lib/', '-o', 'some/file.js']);
    }).to.throw('The --replace and --out-file options cannot be used together.');
  });

  it('when --replace used with existing dir name, turns it into glob pattern', () => {
    const options = parse(['-t', 'class', '--replace', 'lib/']);
    expect(options.inFile).to.equal(undefined);
    expect(options.outFile).to.equal(undefined);
    expect(options.replace).to.equal('lib/**/*.js');
  });
});
