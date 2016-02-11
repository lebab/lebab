var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer({
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
  transformer.read(script);
  transformer.applyTransformations();
  return transformer.out();
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

});
