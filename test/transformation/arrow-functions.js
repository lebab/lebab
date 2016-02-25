var expect = require('chai').expect;
import Transformer from './../../lib/transformer';
var transformer = new Transformer({arrow: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Callback to Arrow transformation', () => {

  it('should convert simple callbacks', () => {
    var script = 'setTimeout(function() { return 2; });';

    expect(test(script)).to.equal('setTimeout(() => 2);');
  });

  it('should convert callbacks with a single argument', () => {
    var script = 'a(function(b) { return b; });';

    expect(test(script)).to.equal('a(b => b);');
  });

  it('should convert callbacks with multiple arguments', () => {
    var script = 'a(function(b, c) { return b; });';

    expect(test(script)).to.equal('a((b, c) => b);');
  });

  it('should convert function assignment', () => {
    var script = 'x = function () { foo(); };';

    expect(test(script)).to.equal('x = () => { foo(); };');
  });

  it('should convert immediate function invocation', () => {
    var script = '(function () { foo(); }());';

    expect(test(script)).to.equal('((() => { foo(); })());');
  });

  it('should convert returning of a function', () => {
    var script = 'function foo () { return function() { foo(); }; }';

    expect(test(script)).to.equal('function foo () { return () => { foo(); }; }');
  });

  it('should convert functions using `this` keyword inside a nested function', () => {
    var script = 'a(function () { return function() { this; }; });';

    expect(test(script)).to.equal('a(() => function() { this; });');
  });

  it('should convert functions using `arguments` inside a nested function', () => {
    var script = 'a(function () { return function() { arguments; }; });';

    expect(test(script)).to.equal('a(() => function() { arguments; });');
  });

  it('should preserve default parameters', () => {
    var script = 'foo(function (a=1, b=2, c) { });';

    expect(test(script)).to.equal('foo((a=1, b=2, c) => { });');
  });

  it('should preserve rest parameters', () => {
    var script = 'foo(function (x, ...xs) { });';

    expect(test(script)).to.equal('foo((x, ...xs) => { });');
  });


  it('should not convert function declarations', () => {
    expectNoChange('function foo() {};');
  });

  it('should not convert named function expressions', () => {
    expectNoChange('f = function fact(n) { return n * fact(n-1); };');
  });

  it('should not convert generators', () => {
    expectNoChange('f = function* (n) { };');
  });

  it('should not convert functions using `this` keyword', () => {
    expectNoChange('a(function () { this; });');
    expectNoChange('a(function () { this.x = 2; });');
    expectNoChange('a(function () { this.bar(); });');
    expectNoChange('a(function () { foo(this); });');
    expectNoChange('a(function () { foo(this.bar); });');
    expectNoChange('a(function () { return this; });');
    expectNoChange('a(function () { if (x) foo(this); });');
    expectNoChange('a(function () { for (x of foo) { bar(this); } });');
  });

  it('should not convert functions using `arguments`', () => {
    expectNoChange('a(function () { arguments; });');
    expectNoChange('a(function () { foo(arguments); });');
    expectNoChange('a(function () { return arguments[0] + 1; });');
    expectNoChange('a(function () { return Array.slice.apply(arguments); });');
    expectNoChange('a(function () { if (x) foo(arguments); });');
  });

  it('should not convert object methods', () => {
    expectNoChange('({foo() {}});');
    expectNoChange('({foo: function() {}});');
  });

  it('should not convert class methods', () => {
    expectNoChange(
      'class Foo {\n' +
      '  bar() {}\n' +
      '}'
    );
  });

});
