import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'obj-method': true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Object methods', () => {

  it('should convert a function inside an object to method', () => {
    expect(test(
      '({\n' +
      '  someMethod: function(a, b, c) {\n' +
      '    return a + b + c;\n' +
      '  }\n' +
      '});'
    )).to.equal(
      '({\n' +
      '  someMethod(a, b, c) {\n' +
      '    return a + b + c;\n' +
      '  }\n' +
      '});'
    );
  });

  it('should ignore non-function properties of object', () => {
    expect(test(
      '({\n' +
      '  foo: 123,\n' +
      '  method1: function() {\n' +
      '  },\n' +
      '  bar: [],\n' +
      '  method2: function() {\n' +
      '  },\n' +
      '});'
    )).to.equal(
      '({\n' +
      '  foo: 123,\n' +
      '  method1() {\n' +
      '  },\n' +
      '  bar: [],\n' +
      '  method2() {\n' +
      '  },\n' +
      '});'
    );
  });

  it('should convert function properties in nested object literal', () => {
    expect(test(
      '({\n' +
      '  nested: {\n' +
      '    method: function() {\n' +
      '    }\n' +
      '  }\n' +
      '});'
    )).to.equal(
      '({\n' +
      '  nested: {\n' +
      '    method() {\n' +
      '    }\n' +
      '  }\n' +
      '});'
    );
  });

  it('should not convert named function expressions', () => {
    expectNoChange(
      '({\n' +
      '  foo: function foo() {\n' +
      '    return foo();\n' +
      '  }\n' +
      '});'
    );
  });

  it('should not convert computed properties', () => {
    expectNoChange(
      '({\n' +
      '  ["foo" + count]: function() {\n' +
      '  }\n' +
      '});'
    );
  });

});
