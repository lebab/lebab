var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({'default-param': true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Default parameters', function () {

  it('should work for simple, single parameter function declarations', function () {
    expect(test(
      'function x(a) {\n' +
      '  a = a || 2;\n' +
      '}'
    )).to.equal(
      'function x(a=2) {}'
    );
  });

  it('should work for different types of parameters', function () {
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

  it('should work when only some parameters have defaults', function () {
    expect(test(
      'function x(a, b, c) {\n' +
      '  b = b || 3;\n' +
      '}'
    )).to.equal(
      'function x(a, b=3, c) {}'
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

  xit('should work for nested functions with similar parameter names', function () {
    expect(test(
      'function x(a) {\n' +
      '  function y(a) {\n' +
      '    a = a || 3;\n' +
      '  }\n' +
      '  a = a || 2;\n' +
      '}'
    )).to.equal(
      'function x(a=2) {\n' +
      '  function y(a=3) {}\n' +
      '}'
    );
  });

  xit('should ignore parameters modified before assigning default', function () {
    expectNoChange(
      'function x(a) {\n' +
      '  a = foo();\n' +
      '  a = a || 2;\n' +
      '}'
    );
  });

  xit('should ignore parameters when any other code executed before assigning default', function () {
    expectNoChange(
      'function x(a) {\n' +
      '  foo();\n' +
      '  a = a || 2;\n' +
      '  function foo() {\n' +
      '    a++;\n' +
      '  }\n' +
      '}'
    );
  });

  it('should work for function expressions', function () {
    expect(test(
      'foo(function(a) {\n' +
      '  a = a || 2;\n' +
      '});'
    )).to.equal(
      'foo(function(a=2) {});'
    );
  });

  xit('should work for arrow function expressions', function () {
    expect(test(
      'foo((a) => {\n' +
      '  a = a || 2;\n' +
      '});'
    )).to.equal(
      'foo((a=2) => {});'
    );
  });

  xit('should preserve existing default parameters', function () {
    expectNoChange(
      'function x(a="salam", b={}, c=[]) {}'
    );
  });

  xit('should not override existing default parameters', function () {
    expectNoChange(
      'function x(a=25) {\n' +
      '  a = a || 2;\n' +
      '}'
    );
  });

  // Regression test for issue #89
  xit('should preserve long parameter lists as is when there are no defaults', function () {
    expectNoChange(
      'function foo(variable1, variable2, variable3, variable4, variable5, variable6, variable7, variable8) {}'
    );
  });

});
