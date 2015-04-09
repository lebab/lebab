var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer();

describe('Callback to Arrow transformation', function () {

  it('should convert simple callbacks', function () {
    var script = 'setTimeout(function() { return 2 })';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('setTimeout(() => {\n    return 2;\n});');
  });

  it('should convert callbacks with a single argument', function () {
    var script = 'a(function(b) { return b });';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('a(b => {\n    return b;\n});');
  });

  it('should convert callbacks with a single argument', function () {
    var script = 'a(function(b, c) { return b });';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('a((b, c) => {\n    return b;\n});');
  });


  it('shouldn\'t convert other forms of functions', function () {
    var script = 'var x = function () {\n};';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
  });

  it('shouldn\'t convert functions using `this` keyword', function () {
    var script = 'a(function (b) {\n    this.x = 2;\n});';

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
  });

});