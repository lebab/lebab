var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({'obj-method': true});

function test(script) {
  return transformer.run(script);
}

describe('Object methods', function () {

  it('should convert a function inside an object to method', function () {
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

  it('should ignore non-function properties of object', function () {
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

});
