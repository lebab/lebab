var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  defaultArgsTransformation = require('./../../lib/transformation/default-arguments'),
  transformer = new Transformer();

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(defaultArgsTransformation);
  return transformer.out();
}

describe('Default Arguments', function () {

  it('should work for simple, single argument function declarations', function () {
    var script = 'function x(a) { a = a || 2 }';

    expect(test(script)).to.equal('function x(a = 2) {\n}');
  });

  it('should work for different types of arguments', function () {
    var script = 'function x(a, b, c) { a = a || "salam"; b = b || {}; c = c || [] }';

    expect(test(script)).to.equal('function x(a = \'salam\', b = {}, c = []) {\n}');
  });

  it('should work for multiple functions', function () {
    var script = 'function x(a) { a = a || 2 }; function y(a) { a = a || 3 }';

    expect(test(script)).to.equal('function x(a = 2) {\n}\n;\nfunction y(a = 3) {\n}');
  });

  it('should work for function expressions', function () {
    var script = 'b(function(a) { a = a || 2 })';

    expect(test(script)).to.equal('b(function (a = 2) {\n});');
  });
});