import {expect} from 'chai';
import fs from 'fs';
import {exec} from 'child_process';

describe('Smoke test for the executable script', () => {
  beforeEach(() => {
    fs.writeFileSync(
      'test/test-data.js',
      'var foo = 10;\n' +
      '[1, 2, 3].map(function(x) { return x*x });'
    );
  });

  afterEach(() => {
    fs.unlinkSync('test/test-data.js');
    if (fs.existsSync('test/output.js')) {
      fs.unlinkSync('test/output.js');
    }
  });

  describe('when valid input and output file given', () => {
    it('transforms input file to output file', done => {
      exec('node ./bin/index.js -t let,arrow test/test-data.js -o test/output.js', (error, stdout, stderr) => {
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
      exec('node ./bin/index.js -t let,arrow < test/test-data.js > test/output.js', (error, stdout, stderr) => {
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
      exec('node ./bin/index.js --transform blah test/test-data.js', (error, stdout, stderr) => {
        expect(error).not.to.equal(null);
        expect(stderr).to.equal('Unknown transform "blah".\n');
        expect(stdout).to.equal('');

        expect(fs.existsSync('test/output.js')).to.equal(false);
        done();
      });
    });
  });

  describe('when transform generates warnings', () => {
    beforeEach(() => {
      fs.writeFileSync(
        'test/test-data-warnings.js',
        'if (true) { var x = 10; }\n x = 12;\n'
      );
    });

    afterEach(() => {
      fs.unlinkSync('test/test-data-warnings.js');
    });

    it('logs warnings to STDERR', done => {
      exec('node ./bin/index.js --transform let test/test-data-warnings.js', (error, stdout, stderr) => {
        expect(error).to.equal(null);
        expect(stderr).to.equal('1:  warning  Unable to transform var  (let)\n');
        expect(stdout).to.equal('if (true) { var x = 10; }\n x = 12;\n');
        done();
      });
    });
  });
});
