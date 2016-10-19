import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['arg-rest']);

describe('Arguments variable to ...args', () => {
  it('does not replace arguments outside a function', () => {
    expectNoChange(
      'console.log(arguments);'
    );
  });

  it('replaces arguments in function declaration', () => {
    expectTransform(
      'function foo() {\n' +
      '  console.log(arguments);\n' +
      '}'
    ).toReturn(
      'function foo(...args) {\n' +
      '  console.log(args);\n' +
      '}'
    );
  });

  it('replaces arguments in function expression', () => {
    expectTransform(
      'var foo = function() {\n' +
      '  console.log(arguments);\n' +
      '};'
    ).toReturn(
      'var foo = function(...args) {\n' +
      '  console.log(args);\n' +
      '};'
    );
  });

  it('replaces arguments in class method', () => {
    expectTransform(
      'class Foo {\n' +
      '  bar() {\n' +
      '    console.log(arguments);\n' +
      '  }\n' +
      '}'
    ).toReturn(
      'class Foo {\n' +
      '  bar(...args) {\n' +
      '    console.log(args);\n' +
      '  }\n' +
      '}'
    );
  });

  // `arguments` in arrow function reference the `arguments` in enclosing scope

  it('does not replace arguments in arrow function', () => {
    expectNoChange(
      'var foo = () => console.log(arguments);'
    );
  });

  it('replaces arguments in nested arrow function', () => {
    expectTransform(
      'function foo() {\n' +
      '  var bar = () => console.log(arguments);\n' +
      '}'
    ).toReturn(
      'function foo(...args) {\n' +
      '  var bar = () => console.log(args);\n' +
      '}'
    );
  });

  // Handling of conflicts with existing variables
  it('does not replace arguments when args variable already exists', () => {
    expectNoChange(
      'function foo() {\n' +
      '  var args = [];\n' +
      '  console.log(arguments);\n' +
      '}'
    );
  });

  it('does not replace arguments when args variable exists in parent scope', () => {
    expectNoChange(
      'var args = [];\n' +
      'function foo() {\n' +
      '  console.log(args, arguments);\n' +
      '}'
    );
  });

  it('does not replace arguments when args variable exists in parent function param', () => {
    expectNoChange(
      'function parent(args) {\n' +
      '  function foo() {\n' +
      '    console.log(args, arguments);\n' +
      '  }\n' +
      '}'
    );
  });

  it('does not replace arguments when args variable exists in child block scope that uses arguments', () => {
    expectNoChange(
      'function foo() {\n' +
      '  if (true) {\n' +
      '    const args = 0;\n' +
      '    console.log(arguments);\n' +
      '  }\n' +
      '}'
    );
  });

  it('does not replace arguments in function declaration with existing formal params', () => {
    expectNoChange(
      'function foo(a, b ,c) {\n' +
      '  console.log(arguments);\n' +
      '}'
    );
  });

  it('does not add ...args to function that does not use arguments', () => {
    expectNoChange(
      'function foo() {\n' +
      '  console.log(a, b, c);\n' +
      '}'
    );
  });
});
