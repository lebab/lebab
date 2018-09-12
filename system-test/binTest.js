/* eslint-disable prefer-arrow-callback */
import {expect} from 'chai';
import fs from 'fs';
import {exec} from 'child_process';

const INPUT_FILE = 'system-test/test-data.js';
const INPUT_WARNINGS_FILE = 'system-test/test-data-warnings.js';
const OUTPUT_FILE = 'system-test/output.js';

describe('Smoke test for the executable script', function() {
  beforeEach(() => {
    fs.writeFileSync(
      INPUT_FILE,
      'var foo = 10;\n' +
      '[1, 2, 3].map(function(x) { return x*x });'
    );
  });

  afterEach(() => {
    fs.unlinkSync(INPUT_FILE);
    if (fs.existsSync(OUTPUT_FILE)) {
      fs.unlinkSync(OUTPUT_FILE);
    }
  });

  describe('when valid input and output file given', function() {
    it('transforms input file to output file', done => {
      exec(`node ./bin/index.js -t let,arrow ${INPUT_FILE} -o ${OUTPUT_FILE}`, (error, stdout, stderr) => {
        expect(error).to.equal(null); // eslint-disable-line no-null/no-null
        expect(stderr).to.equal('');
        expect(stdout).to.equal('');

        expect(fs.readFileSync(OUTPUT_FILE).toString()).to.equal(
          'const foo = 10;\n' +
          '[1, 2, 3].map(x => { return x*x });'
        );
        done();
      });
    });
  });

  describe('when no input/output files given', () => {
    it('reads STDIN and writes STDOUT', done => {
      exec(`node ./bin/index.js -t let,arrow < ${INPUT_FILE} > ${OUTPUT_FILE}`, (error, stdout, stderr) => {
        expect(error).to.equal(null); // eslint-disable-line no-null/no-null
        expect(stderr).to.equal('');
        expect(stdout).to.equal('');

        expect(fs.readFileSync(OUTPUT_FILE).toString()).to.equal(
          'const foo = 10;\n' +
          '[1, 2, 3].map(x => { return x*x });'
        );
        done();
      });
    });
  });

  describe('when invalid transform name given', () => {
    it('exits with error message', done => {
      exec(`node ./bin/index.js --transform blah ${INPUT_FILE}`, (error, stdout, stderr) => {
        expect(error).not.to.equal(null); // eslint-disable-line no-null/no-null
        expect(stderr).to.equal('Unknown transform "blah".\n');
        expect(stdout).to.equal('');

        expect(fs.existsSync(OUTPUT_FILE)).to.equal(false);
        done();
      });
    });
  });

  describe('when transform generates warnings', () => {
    beforeEach(() => {
      fs.writeFileSync(
        INPUT_WARNINGS_FILE,
        'if (true) { var x = 10; }\n x = 12;\n'
      );
    });

    afterEach(() => {
      fs.unlinkSync(INPUT_WARNINGS_FILE);
    });

    it('logs warnings to STDERR', done => {
      exec(`node ./bin/index.js --transform let ${INPUT_WARNINGS_FILE}`, (error, stdout, stderr) => {
        expect(error).to.equal(null); // eslint-disable-line no-null/no-null
        expect(stderr).to.equal(`${INPUT_WARNINGS_FILE}:\n1:  warning  Unable to transform var  (let)\n`);
        expect(stdout).to.equal('if (true) { var x = 10; }\n x = 12;\n');
        done();
      });
    });
  });
});
