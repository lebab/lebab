var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({
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

function test(script) {
  return transformer.run(script);
}

describe('Comments', function () {

  it("shouldn't convert comment line", function (done) {
    var script = '// comment line\nvar x = 42;';

    expect(test(script)).to.equal('// comment line\nconst x = 42;');
    done();
  });

  it("shouldn't convert trailing comment", function (done) {
    var script = 'var x = 42; // trailing comment';

    expect(test(script)).to.equal('const x = 42; // trailing comment');
    done();
  });

  it("shouldn't eliminate leading newlines", function () {
    expect(test(
      '\n\nvar x = 42;'
    )).to.equal(
      '\n\nconst x = 42;'
    );
  });

  it("shouldn't eliminate trailing newlines", function () {
    expect(test(
      'var x = 42;\n\n'
    )).to.equal(
      'const x = 42;\n\n'
    );
  });

});
