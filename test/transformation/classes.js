var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({classes: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Classes', function () {

  it('should not convert functions without prototype assignment to class', function () {
    expectNoChange(
      "function MyClass() {\n" +
      "}"
    );
  });

  it('should convert function declarations with prototype assignment to class', function () {
    expect(test(
      "function MyClass() {\n" +
      "}\n" +
      "MyClass.prototype.method = function(a, b) {\n" +
      "};"
    )).to.equal(
      "class MyClass {\n" +
      "  method(a, b) {\n" +
      "  }\n" +
      "}"
    );
  });

  it('should convert function variables with prototype assignment to class', function () {
    expect(test(
      "var MyClass = function() {\n" +
      "};\n" +
      "MyClass.prototype.method = function() {\n" +
      "};"
    )).to.equal(
      "class MyClass {\n" +
      "  method() {\n" +
      "  }\n" +
      "}"
    );
  });

  it('should not convert arrow-function to class', function () {
    expectNoChange(
      "var MyClass = () => {\n" +
      "  this.foo = 10;\n" +
      "};\n" +
      "MyClass.prototype.method = () => {\n" +
      "  return this.foo;\n" +
      "};"
    );
  });

  it('should not convert arrow-function to method', function () {
    expectNoChange(
      "function MyClass() {\n" +
      "}\n" +
      "MyClass.prototype.method = () => {\n" +
      "  return this.foo;\n" +
      "};"
    );
  });

  it('should convert non-empty function to constructor method', function () {
    expect(test(
      "function MyClass(a, b) {\n" +
      "  this.params = [a, b];\n" +
      "}\n" +
      "MyClass.prototype.method = function(ma, mb) {\n" +
      "};"
    )).to.equal(
      "class MyClass {\n" +
      "  constructor(a, b) {\n" +
      "    this.params = [a, b];\n" +
      "  }\n" +
      "\n" +
      "  method(ma, mb) {\n" +
      "  }\n" +
      "}"
    );
  });

  it('should not convert non-anonymous functions to methods', function () {
    expectNoChange(
      "function MyClass() {\n" +
      "}\n" +
      "MyClass.prototype.method = method;\n" +
      "function method(a, b) {\n" +
      "}"
    );
  });

  it('should ignore non-function assignments to prototype', function () {
    expect(test(
      "function MyClass() {\n" +
      "}\n" +
      "MyClass.prototype.count = 10;\n" +
      "MyClass.prototype.method = function() {\n" +
      "};\n" +
      "MyClass.prototype.hash = {foo: 'bar'};"
    )).to.equal(
      "class MyClass {\n" +
      "  method() {\n" +
      "  }\n" +
      "}\n" +
      "\n" +
      "MyClass.prototype.count = 10;\n" +
      "MyClass.prototype.hash = {foo: 'bar'};"
    );
  });

  it('should detect methods from object assigned directly to prototype', function () {
    expect(test(
      "function MyClass() {\n" +
      "}\n" +
      "MyClass.prototype = {\n" +
      "  methodA: function(a) {\n" +
      "  },\n" +
      "  methodB: function(b) {\n" +
      "  }\n" +
      "};"
    )).to.equal(
      "class MyClass {\n" +
      "  methodA(a) {\n" +
      "  }\n" +
      "\n" +
      "  methodB(b) {\n" +
      "  }\n" +
      "}"
    );
  });

  it('should ignore object assigned directly to prototype when it contains non-functions', function () {
    expectNoChange(
      "function MyClass() {\n" +
      "}\n" +
      "MyClass.prototype = {\n" +
      "  method: function(a) {\n" +
      "  },\n" +
      "  foo: 10\n" +
      "};"
    );
  });

  it('should convert Object.defineProperty to setters and getters', function () {
    expect(test(
      "function MyClass() {\n" +
      "}\n" +
      "Object.defineProperty(MyClass.prototype, 'someAccessor', {\n" +
      "  get: function () {\n" +
      "    return this._some;\n" +
      "  },\n" +
      "  set: function (value) {\n" +
      "    this._some = value;\n" +
      "  }\n" +
      "});"
    )).to.equal(
      "class MyClass {\n" +
      "  get someAccessor() {\n" +
      "    return this._some;\n" +
      "  }\n" +
      "\n" +
      "  set someAccessor(value) {\n" +
      "    this._some = value;\n" +
      "  }\n" +
      "}"
    );
  });

  it('should ignore Object.defineProperty of non-function property', function () {
    expectNoChange(
      "function MyClass() {\n" +
      "}\n" +
      "Object.defineProperty(MyClass.prototype, 'propName', {\n" +
      "  value: 10,\n" +
      "  configurable: true,\n" +
      "  writable: true\n" +
      "});"
    );
  });

  it('should ignore Object.defineProperty with arrow-function', function () {
    expectNoChange(
      "function MyClass() {\n" +
      "}\n" +
      "Object.defineProperty(MyClass.prototype, 'getter', {\n" +
      "  get: () => this.something\n" +
      "});"
    );
  });

});
