var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  arrowTransformation = require('./../../lib/transformation/arrow-functions'),
  transformer = new Transformer({formatter: false});

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(arrowTransformation);
  return transformer.out();
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Callback to Arrow transformation', function () {

  it('should convert simple callbacks', function () {
    var script = 'setTimeout(function() { return 2; });';

    expect(test(script)).to.equal('setTimeout(() => { return 2; });');
  });

  it('should convert callbacks with a single argument', function () {
    var script = 'a(function(b) { return b; });';

    expect(test(script)).to.equal('a(b => { return b; });');
  });

  it('should convert callbacks with multiple arguments', function () {
    var script = 'a(function(b, c) { return b; });';

    expect(test(script)).to.equal('a((b, c) => { return b; });');
  });


  it('should not convert other forms of functions', function () {
    expectNoChange('var x = function () {};');
  });

  it('should not convert functions using `this` keyword', function () {
    expectNoChange('a(function (b) { this.x = 2; });');
  });

});
