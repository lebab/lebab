import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['arrow-return']);

describe('Arrow functions with return', () => {
  it('should convert basic arrow function', () => {
    expectTransform(
      'a(() => { return 123; });'
    ).toReturn(
      'a(() => 123);'
    );
  });

  it('should convert arrow function inside variable declaration', () => {
    expectTransform(
      'const a = () => { return 123; }'
    ).toReturn(
      'const a = () => 123'
    );
  });

  it('should convert arrow function inside object', () => {
    expectTransform(
      '({ foo: () => { return 123; } })'
    ).toReturn(
      '({ foo: () => 123 })'
    );
  });

  it('should convert nested arrow functions', () => {
    expectTransform(
      'a(() => { return () => { const b = c => { return c; } }; })'
    ).toReturn(
      'a(() => () => { const b = c => c })'
    );
  });

  // Even when `this` or `arguments` is used inside arrow function,
  // it's still fine to convert it to shorthand syntax.
  // (We need to watch out for these in `arrow` transform though.)

  it('should convert arrow function using `this` keyword', () => {
    expectTransform(
      'function Foo() {\n' +
      '  setTimeout(() => { return this; });\n' +
      '}'
    ).toReturn(
      'function Foo() {\n' +
      '  setTimeout(() => this);\n' +
      '}'
    );
  });

  it('should convert arrow function using `arguments` keyword', () => {
    expectTransform(
      'function func() {\n' +
      '  setTimeout(() => { return arguments; });\n' +
      '}'
    ).toReturn(
      'function func() {\n' +
      '  setTimeout(() => arguments);\n' +
      '}'
    );
  });

  it('should convert returning an object', () => {
    expectTransform(
      'var f = a => { return {a: 1}; };'
    ).toReturn(
      'var f = a => ({\n' +
      '  a: 1\n' +
      '});'
    );
  });

  it('should convert returning an object property access', () => {
    expectTransform(
      'var f = (a) => { return {a: 1}[a]; };'
    ).toReturn(
      'var f = a => ({\n' +
      '  a: 1\n' +
      '})[a];'
    );
  });

  it('should convert return statements inside a parenthesized arrow function', () => {
    expectTransform(
      'const x = (a => { return a; }).call(null, 1);'
    ).toReturn(
      'const x = (a => a).call(null, 1);'
    );
  });

  it('should preserve comments', () => {
    expectTransform(
      'a(b => {\n' +
      '  // comment\n' +
      '  return b;\n' +
      '});'
    ).toReturn(
      'a(b => // comment\n' +
      'b);'
    );
  });

  it('should not convert arrow functions without return keyword', () => {
    expectNoChange('a(() => {});');
  });

  it('should not convert return statements from non-arrow function', () => {
    expectNoChange('const a = function(b) { return b; };');
  });

  it('should not convert return statements from non-arrow function inside a nested arrow function', () => {
    expectNoChange('const a = b => { const c = function(d) { return d; } };');
  });

  it('should preserve code after return statement', () => {
    expectNoChange(
      'a(() => {\n' +
      '  return func;\n' +
      '  function func() {}\n' +
      '});'
    );
  });
});
