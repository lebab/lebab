var expect = require('chai').expect;
var fs = require("fs");
var exec = require('child_process').exec;

describe('Smoke test for the executable script', () => {
  beforeEach(() => {
    fs.writeFileSync(
      "test/test-data.js",
      'var foo = 10;\n' +
      '[1, 2, 3].map(function(x) { return x*x });'
    );
  });

  afterEach(() => {
    fs.unlinkSync("test/test-data.js");
    if (fs.existsSync("test/output.js")) {
      fs.unlinkSync("test/output.js");
    }
  });

  describe('when valid input and output file given', () => {
    it('transforms input file to output file', done => {
      exec('node ./bin/index.js test/test-data.js -o test/output.js', (error, stdout, stderr) => {
        expect(error).to.equal(null);
        expect(stderr).to.equal('');
        expect(stdout).to.equal('');

        expect(fs.readFileSync('test/output.js').toString()).to.equal(
          'const foo = 10;\n' +
          '[1, 2, 3].map(x => x*x);'
        );
        done();
      });
    });
  });

  describe('when no input/output files given', () => {
    it('reads STDIN and writes STDOUT', done => {
      exec('node ./bin/index.js < test/test-data.js > test/output.js', (error, stdout, stderr) => {
        expect(error).to.equal(null);
        expect(stderr).to.equal('');
        expect(stdout).to.equal('');

        expect(fs.readFileSync('test/output.js').toString()).to.equal(
          'const foo = 10;\n' +
          '[1, 2, 3].map(x => x*x);'
        );
        done();
      });
    });
  });

  describe('when invalid transform name given', () => {
    it('exits with error message', done => {
      exec('node ./bin/index.js --enable blah test/test-data.js', (error, stdout, stderr) => {
        expect(error).not.to.equal(null);
        expect(stderr).to.equal('Unknown transformer "blah".\n');
        expect(stdout).to.equal('');

        expect(fs.existsSync('test/output.js')).to.equal(false);
        done();
      });
    });
  });
});
