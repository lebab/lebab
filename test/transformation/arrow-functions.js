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

    expect(test(script)).to.equal('setTimeout(() => 2);');
  });

  it('should convert callbacks with a single argument', function () {
    var script = 'a(function(b) { return b; });';

    expect(test(script)).to.equal('a(b => b);');
  });

  it('should convert callbacks with multiple arguments', function () {
    var script = 'a(function(b, c) { return b; });';

    expect(test(script)).to.equal('a((b, c) => b);');
  });

  it('should convert function assignment', function () {
    var script = 'x = function () { foo(); };';

    expect(test(script)).to.equal('x = () => { foo(); };');
  });

  it('should convert immediate function invocation', function () {
    var script = '(function () { foo(); }());';

    expect(test(script)).to.equal('((() => { foo(); })());');
  });

  it('should convert returning of a function', function () {
    var script = 'function foo () { return function() { foo(); }; }';

    expect(test(script)).to.equal('function foo () { return () => { foo(); }; }');
  });

  it('should convert functions using `this` keyword inside a nested function', function () {
    var script = 'a(function () { return function() { this; }; });';

    expect(test(script)).to.equal('a(() => function() { this; });');
  });


  it('should not convert function declarations', function () {
    expectNoChange('function foo() {};');
  });

  it('should not convert named function expressions', function () {
    expectNoChange('f = function fact(n) { return n * fact(n-1); };');
  });

  it('should not convert functions using `this` keyword', function () {
    expectNoChange('a(function () { this; });');
    expectNoChange('a(function () { this.x = 2; });');
    expectNoChange('a(function () { this.bar(); });');
    expectNoChange('a(function () { foo(this); });');
    expectNoChange('a(function () { foo(this.bar); });');
    expectNoChange('a(function () { return this; });');
    expectNoChange('a(function () { if (x) foo(this); });');
    expectNoChange('a(function () { for (x of foo) { bar(this); } });');
  });

});
