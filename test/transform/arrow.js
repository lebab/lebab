import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers({'arrow': true});

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
      expectNoChange('a(function () { arguments; }.bind(this));');
    });

    it('should not convert generator functions', () => {
      expectNoChange('a(function* () { }.bind(this));');
    });

    it('should not convert named function expressions', () => {
      expectNoChange('a(function foo() { });');
    });
  });
});
