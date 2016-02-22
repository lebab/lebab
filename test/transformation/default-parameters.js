var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({'default-param': true});

function test(script) {
  return transformer.run(script);
}

describe('Default parameters', function () {

  it('should work for simple, single argument function declarations', function () {
    expect(test(
      'function x(a) {\n' +
      '  a = a || 2;\n' +
      '}'
    )).to.equal(
      'function x(a=2) {}'
    );
  });

  it('should work for different types of arguments', function () {
    expect(test(
      'function x(a, b, c) {\n' +
      '  a = a || "salam";\n' +
      '  b = b || {};\n' +
      '  c = c || [];\n'+
      '}'
    )).to.equal(
      'function x(a="salam", b={}, c=[]) {}'
    );
  });

  it('should work for multiple functions', function () {
    expect(test(
      'function x(a) { a = a || 2; }\n' +
      'function y(a) { a = a || 3; }'
    )).to.equal(
      'function x(a=2) {}\n' +
      'function y(a=3) {}'
    );
  });

  it('should work for function expressions', function () {
    expect(test(
      '(function(a) {\n' +
      '  a = a || 2;\n' +
      '})();'
    )).to.equal(
      '(function(a=2) {})();'
    );
  });
});
