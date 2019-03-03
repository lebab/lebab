import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['arrow']);

describe('Arrow functions', () => {
  it('should convert simple callbacks', () => {
    expectTransform(
      'setTimeout(function() { return 2; });'
    ).toReturn('setTimeout(() => { return 2; });');
  });

  it('should convert callbacks with a single argument', () => {
    expectTransform(
      'a(function(b) { return b; });'
    ).toReturn('a(b => { return b; });');
  });

  it('should convert callbacks with multiple arguments', () => {
    expectTransform(
      'a(function(b, c) { return b; });'
    ).toReturn(
      'a((b, c) => { return b; });'
    );
  });

  it('should preserve async on anonymous function expression with no argument', () => {
    expectTransform(
      'f = async function() { return 1; };'
    ).toReturn(
      'f = async () => { return 1; };'
    );
  });

  it('should preserve async on anonymous function expression with single argument', () => {
    expectTransform(
      'f = async function(a) { return a; };'
    ).toReturn(
      'f = async a => { return a; };'
    );
  });

  it('should preserve async on anonymous function assignment with multiple arguments', () => {
    expectTransform(
      'f = async function(a,b) { return a; };'
    ).toReturn(
      'f = async (a, b) => { return a; };'
    );
  });

  it('should preserve async on immediate function invocation', () => {
    expectTransform(
      '(async function () { await foo(); }());'
    ).toReturn(
      '(async () => { await foo(); })();'
    );
  });

  it('should preserve async on immediate function invocation with arguments', () => {
    expectTransform(
      '(async function (a) { await foo(a); }());'
    ).toReturn(
      '(async a => { await foo(a); })();'
    );
  });

  it('should convert function assignment', () => {
    expectTransform(
      'x = function () { foo(); };'
    ).toReturn(
      'x = () => { foo(); };'
    );
  });

  // Issue #187
  it('should convert immediate function invocation', () => {
    expectTransform(
      '(function () { foo(); }());'
    ).toReturn(
      '(() => { foo(); })();'
    );
  });

  it('should convert returning of a function', () => {
    expectTransform(
      'function foo () { return function() { foo(); }; }'
    ).toReturn(
      'function foo () { return () => { foo(); }; }'
    );
  });

  it('should convert functions using `this` keyword inside a nested function', () => {
    expectTransform(
      'a(function () { return function() { this; }; });'
    ).toReturn(
      'a(() => { return function() { this; }; });'
    );
  });

  it('should convert functions using `arguments` inside a nested function', () => {
    expectTransform(
      'a(function () { return function() { arguments; }; });'
    ).toReturn(
      'a(() => { return function() { arguments; }; });'
    );
  });

  it('should preserve default parameters', () => {
    expectTransform(
      'foo(function (a=1, b=2, c) { });'
    ).toReturn(
      'foo((a=1, b=2, c) => { });'
    );
  });

  it('should preserve rest parameters', () => {
    expectTransform(
      'foo(function (x, ...xs) { });'
    ).toReturn(
      'foo((x, ...xs) => { });'
    );
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
        'a(() => { return 123; });'
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

    it('should not convert when arguments also bound', () => {
      expectNoChange('a(function(a,b,c) { return this; }.bind(this, 1, 2, 3));');
    });
  });

  describe('functions with methods invoked', () => {
    it('get parentheses added around the arrow function when needed', () => {
      expectTransform(
        'x = function(a) { return a; }.call(null, 1);'
      ).toReturn(
        'x = (a => { return a; }).call(null, 1);'
      );
    });
  });

  it('should preserve comments', () => {
    expectTransform(
      'a(\n' +
      '  // comment before\n' +
      '  function(b) {\n' +
      '    return b;\n' +
      '  }\n' +
      '  // comment after\n' +
      ');'
    ).toReturn(
      'a(\n' +
      '  // comment before\n' +
      '  b => {\n' +
      '    return b;\n' +
      '  }\n' +
      '  // comment after\n' +
      ');'
    );
  });
});
