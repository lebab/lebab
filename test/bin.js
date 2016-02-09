var expect = require('chai').expect;
var fs = require("fs");
var exec = require('child_process').exec;

describe('Smoke test for the executable script', function () {
  beforeEach(function () {
    fs.writeFileSync(
      "test/test-data.js",
      'var foo = 10;\n' +
      '[1, 2, 3].map(function(x) { return x*x });'
    );
  });

  afterEach(function () {
    fs.unlinkSync("test/test-data.js");
    if (fs.existsSync("test/output.js")) {
      fs.unlinkSync("test/output.js");
    }
  });

  describe('when valid input and output file given', function() {
    it('transforms input file to output file', function (done) {
      exec('node ./bin/index.js test/test-data.js -o test/output.js', function (error, stdout, stderr) {
        expect(error).to.equal(null);
        expect(stderr).to.equal('');
        expect(stdout).to.equal('The file "test/output.js" has been written.\n');

        expect(fs.readFileSync('test/output.js').toString()).to.equal(
          'const foo = 10;\n' +
          '[1, 2, 3].map(x => x*x);'
        );
        done();
      });
    });
  });

  describe('when no input file given', function () {
    it('exits with error message', function (done) {
      exec('node ./bin/index.js', function (error, stdout, stderr) {
        expect(error).not.to.equal(null);
        expect(stderr).to.equal('Input file name is required.\n');
        expect(stdout).to.equal('');

        expect(fs.existsSync('test/output.js')).to.equal(false);
        done();
      });
    });
  });

});
