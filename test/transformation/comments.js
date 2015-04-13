var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer();

describe('Comments', function () {

  it("shouldn't convert comment line", function (done) {
    var script = '// comment line\nvar x = 42;';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
    done();
  });

  it("shouldn't convert trailing comment", function (done) {
    var script = 'var x = 42;    // trailing comment\n';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
    done();
  });

});
