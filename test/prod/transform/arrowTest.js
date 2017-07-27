const prodHelpers = require('../../prodHelpers');
const {expectTransform, expectNoChange} = prodHelpers(['arrow']);

describe('Arrow functions', () => {
  it('should convert simple callbacks', () => {
    const script = 'setTimeout(function() { return 2; });';

    expectTransform(script).toReturn('setTimeout(() => 2);');
  });

  it('should convert callbacks with a single argument', () => {
    const script = 'a(function(b) { return b; });';

    expectTransform(script).toReturn('a(b => b);');
  });

  it('should convert callbacks with multiple arguments', () => {
    const script = 'a(function(b, c) { return b; });';

    expectTransform(script).toReturn('a((b, c) => b);');
  });

  it('should preserve async on anonymous function expression with no argument', () => {
    const script = 'f = async function() { return 1; };';

    expectTransform(script).toReturn('f = async () => 1;');
  });

  it('should preserve async on anonymous function expression with single argument', () => {
    const script = 'f = async function(a) { return a; };';

    expectTransform(script).toReturn('f = async a => a;');
  });

  it('should preserve async on anonymous function assignment with multiple arguments', () => {
    const script = 'f = async function(a,b) { return a; };';

    expectTransform(script).toReturn('f = async (a, b) => a;');
  });

  it('should preserve async on immediate function invocation', () => {
    const script = '(async function () { await foo(); }());';

    expectTransform(script).toReturn('((async () => { await foo(); })());');
  });

  it('should preserve async on immediate function invocation with arguments', () => {
    const script = '(async function (a) { await foo(a); }());';

    expectTransform(script).toReturn('((async a => { await foo(a); })());');
  });

  it('should convert function assignment', () => {
    const script = 'x = function () { foo(); };';

    expectTransform(script).toReturn('x = () => { foo(); };');
  });

  it('should convert immediate function invocation', () => {
    const script = '(function () { foo(); }());';

    expectTransform(script).toReturn('((() => { foo(); })());');
  });

  it('should convert returning of a function', () => {
    const script = 'function foo () { return function() { foo(); }; }';

    expectTransform(script).toReturn('function foo () { return () => { foo(); }; }');
  });

  it('should convert functions using `this` keyword inside a nested function', () => {
    const script = 'a(function () { return function() { this; }; });';

    expectTransform(script).toReturn('a(() => function() { this; });');
  });

  it('should convert functions using `arguments` inside a nested function', () => {
    const script = 'a(function () { return function() { arguments; }; });';

    expectTransform(script).toReturn('a(() => function() { arguments; });');
  });

  it('should preserve default parameters', () => {
    const script = 'foo(function (a=1, b=2, c) { });';

    expectTransform(script).toReturn('foo((a=1, b=2, c) => { });');
  });

  it('should preserve rest parameters', () => {
    const script = 'foo(function (x, ...xs) { });';

    expectTransform(script).toReturn('foo((x, ...xs) => { });');
  });

  it('should preserve code after return statement', () => {
    expectTransform(
      'a(function() {\n' +
      '  return func;\n' +
      '  function func() {}\n' +
      '});'
    ).toReturn(
      'a(() => {\n' +
      '  return func;\n' +
      '  function func() {}\n' +
      '});'
    );
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
    expectNoChange('a(function () { arguments; });').withWarnings([
      {line: 1, msg: 'Can not use arguments in arrow function', type: 'arrow'}
    ]);
    expectNoChange('a(function () { foo(arguments); });').withWarnings([
      {line: 1, msg: 'Can not use arguments in arrow function', type: 'arrow'}
    ]);
    expectNoChange('a(function () { return arguments[0] + 1; });').withWarnings([
      {line: 1, msg: 'Can not use arguments in arrow function', type: 'arrow'}
    ]);
    expectNoChange('a(function () { return Array.slice.apply(arguments); });').withWarnings([
      {line: 1, msg: 'Can not use arguments in arrow function', type: 'arrow'}
    ]);
    expectNoChange('a(function () { if (x) foo(arguments); });').withWarnings([
      {line: 1, msg: 'Can not use arguments in arrow function', type: 'arrow'}
    ]);
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

  describe('bound functions', () => {
    it('should convert this-using functions', () => {
      expectTransform(
        'a(function (a, b=2, ...c) { this.x = 3; }.bind(this));'
      ).toReturn(
        'a((a, b=2, ...c) => { this.x = 3; });'
      );
    });

    it('should convert immediately returning functions', () => {
      expectTransform(
        'a(function () { return 123; }.bind(this));'
      ).toReturn(
        'a(() => 123);'
      );
    });

    it('should convert object members', () => {
      expectTransform(
        '({foo: function() { this.x = 3; }.bind(this)});'
      ).toReturn(
        '({foo: () => { this.x = 3; }});'
      );
    });

    it('should not convert functions using `arguments`', () => {
      expectNoChange('a(function () { arguments; }.bind(this));').withWarnings([
        {line: 1, msg: 'Can not use arguments in arrow function', type: 'arrow'}
      ]);
    });

    it('should not convert generator functions', () => {
      expectNoChange('a(function* () { }.bind(this));');
    });

    it('should not convert named function expressions', () => {
      expectNoChange('a(function foo() { });');
    });
  });

  describe('functions with methods invoked', () => {
    it('get parentheses added around the arrow function when needed', () => {
      expectTransform(
        'x = function(a) { return a; }.call(null, 1);'
      ).toReturn(
        'x = (a => a).call(null, 1);'
      );
    });
  });

  describe('comments', () => {
    it('should preserve comments when converting to shorthand notation', () => {
      expectTransform(
        'a(function(b) {\n' +
        '  // comment\n' +
        '  return b;\n' +
        '});'
      ).toReturn(
        'a(b => // comment\n' +
        'b);'
      );
    });
  });
});
