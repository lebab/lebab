import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['obj-method']);

describe('Object methods', () => {
  it('should convert a function inside an object to method', () => {
    expectTransform(
      '({\n' +
      '  someMethod: function(a, b, c) {\n' +
      '    return a + b + c;\n' +
      '  }\n' +
      '});'
    ).toReturn(
      '({\n' +
      '  someMethod(a, b, c) {\n' +
      '    return a + b + c;\n' +
      '  }\n' +
      '});'
    ).withoutWarnings();
  });

  it('should ignore non-function properties of object', () => {
    expectTransform(
      '({\n' +
      '  foo: 123,\n' +
      '  method1: function() {\n' +
      '  },\n' +
      '  bar: [],\n' +
      '  method2: function() {\n' +
      '  },\n' +
      '});'
    ).toReturn(
      '({\n' +
      '  foo: 123,\n' +
      '  method1() {\n' +
      '  },\n' +
      '  bar: [],\n' +
      '  method2() {\n' +
      '  },\n' +
      '});'
    ).withoutWarnings();
  });

  it('should convert function properties in nested object literal', () => {
    expectTransform(
      '({\n' +
      '  nested: {\n' +
      '    method: function() {\n' +
      '    }\n' +
      '  }\n' +
      '});'
    ).toReturn(
      '({\n' +
      '  nested: {\n' +
      '    method() {\n' +
      '    }\n' +
      '  }\n' +
      '});'
    ).withoutWarnings();
  });

  it('should not convert named function expressions', () => {
    expectNoChange(
      '({\n' +
      '  foo: function foo() {\n' +
      '    return foo();\n' +
      '  }\n' +
      '});'
    ).withWarnings([
      {line: 2, msg: 'Unable to transform named function', type: 'obj-method'}
    ]);
  });

  it('should not convert computed properties', () => {
    expectNoChange(
      '({\n' +
      '  ["foo" + count]: function() {\n' +
      '  }\n' +
      '});'
    ).withoutWarnings();
  });

  it('should not convert string properties', () => {
    expectNoChange(
      '({\n' +
      '  "foo": function() {\n' +
      '  }\n' +
      '});'
    ).withoutWarnings();
  });

  it('should not convert numeric properties', () => {
    expectNoChange(
      '({\n' +
      '  123: function() {\n' +
      '  }\n' +
      '});'
    ).withoutWarnings();
  });
});
