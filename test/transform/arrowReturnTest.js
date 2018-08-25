import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['arrow-return']);

describe('Arrow functions with return', () => {
  it('should handle simple return callbacks', () => {
    const script = 'setTimeout(() => { return 2; });';
    expectTransform(script).toReturn('setTimeout(() => 2);');
  });
  it('should handle return statements on immediately returning function expressions', () => {
    const script = 'a(() => { return 123; });';
    expectTransform(script).toReturn('a(() => 123);');
  });

  it('should handle return statements on immediately returning function declarations', () => {
    const script = 'const a = () => { return 123; }';
    expectTransform(script).toReturn('const a = () => 123');
  });

  it('should handle return statements inside a nested arrow function', () => {
    const script = 'a(() => { return () => { const b = c => { return c; } }; })';
    expectTransform(script).toReturn('a(() => () => { const b = c => c })');
  });

  it('should handle returning functions using `this` keyword inside a nested function', () => {
    const script = 'a(() => { return function() { this; }; });';
    expectTransform(script).toReturn('a(() => function() { this; });');
  });

  it('should handle returning functions using `arguments` inside a nested function', () => {
    const script = 'a(() => { return function() { arguments; }; });';
    expectTransform(script).toReturn('a(() => function() { arguments; });');
  });

  it('should handle returning an object', () => {
    const script = 'var f = a => { return {a: 1}; };';
    expectTransform(script).toReturn(
      'var f = a => ({\n' +
      '  a: 1\n' +
      '});'
    );
  });

  it('should handle return statements inside a parenthesized arrow function', () => {
    const script = 'const x = (a => { return a; }).call(null, 1);';
    expectTransform(script).toReturn('const x = ((a => a)).call(null, 1);');
  });

  it('should handle return statements from shorthand notation and preserving comments', () => {
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

  it('should not convert return statements from non-arrow function', () => {
    expectNoChange('const a = function(b) { return b; };');
  });

  it('should not convert return statements from non-arrow function inside a nested arrow function', () => {
    expectNoChange('const a = b => { const c = function(d) { return d; } };');
  });

  it('should preserve code after return statement', () => {
    expectNoChange('a(() => {\n' +
      '  return func;\n' +
      '  function func() {}\n' +
      '});');
  });
});
