import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({class: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Classes', () => {

  it('should not convert functions without prototype assignment to class', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}'
    );
  });

  it('should convert function declarations with prototype assignment to class', () => {
    expect(test(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.prototype.method = function(a, b) {\n' +
      '};'
    )).to.equal(
      'class MyClass {\n' +
      '  method(a, b) {\n' +
      '  }\n' +
      '}'
    );
  });

  it('should convert function variables with prototype assignment to class', () => {
    expect(test(
      'var MyClass = function() {\n' +
      '};\n' +
      'MyClass.prototype.method = function() {\n' +
      '};'
    )).to.equal(
      'class MyClass {\n' +
      '  method() {\n' +
      '  }\n' +
      '}'
    );
  });

  it('should not convert arrow-function to class', () => {
    expectNoChange(
      'var MyClass = () => {\n' +
      '  this.foo = 10;\n' +
      '};\n' +
      'MyClass.prototype.method = () => {\n' +
      '  return this.foo;\n' +
      '};'
    );
  });

  it('should not convert arrow-function to method', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.prototype.method = () => {\n' +
      '  return this.foo;\n' +
      '};'
    );
  });

  it('should convert non-empty function to constructor method', () => {
    expect(test(
      'function MyClass(a, b) {\n' +
      '  this.params = [a, b];\n' +
      '}\n' +
      'MyClass.prototype.method = function(ma, mb) {\n' +
      '};'
    )).to.equal(
      'class MyClass {\n' +
      '  constructor(a, b) {\n' +
      '    this.params = [a, b];\n' +
      '  }\n' +
      '\n' +
      '  method(ma, mb) {\n' +
      '  }\n' +
      '}'
    );
  });

  it('should not convert non-anonymous functions to methods', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.prototype.method = method;\n' +
      'function method(a, b) {\n' +
      '}'
    );
  });

  it('should ignore non-function assignments to prototype', () => {
    expect(test(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.prototype.count = 10;\n' +
      'MyClass.prototype.method = function() {\n' +
      '};\n' +
      'MyClass.prototype.hash = {foo: "bar"};'
    )).to.equal(
      'class MyClass {\n' +
      '  method() {\n' +
      '  }\n' +
      '}\n' +
      '\n' +
      'MyClass.prototype.count = 10;\n' +
      'MyClass.prototype.hash = {foo: "bar"};'
    );
  });

  it('should detect methods from object assigned directly to prototype', () => {
    expect(test(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.prototype = {\n' +
      '  methodA: function(a) {\n' +
      '  },\n' +
      '  methodB: function(b) {\n' +
      '  }\n' +
      '};'
    )).to.equal(
      'class MyClass {\n' +
      '  methodA(a) {\n' +
      '  }\n' +
      '\n' +
      '  methodB(b) {\n' +
      '  }\n' +
      '}'
    );
  });

  it('should ignore object assigned directly to prototype when it contains non-functions', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.prototype = {\n' +
      '  method: function(a) {\n' +
      '  },\n' +
      '  foo: 10\n' +
      '};'
    );
  });

  it('should convert Object.defineProperty to setters and getters', () => {
    expect(test(
      'function MyClass() {\n' +
      '}\n' +
      'Object.defineProperty(MyClass.prototype, "someAccessor", {\n' +
      '  get: function () {\n' +
      '    return this._some;\n' +
      '  },\n' +
      '  set: function (value) {\n' +
      '    this._some = value;\n' +
      '  }\n' +
      '});'
    )).to.equal(
      'class MyClass {\n' +
      '  get someAccessor() {\n' +
      '    return this._some;\n' +
      '  }\n' +
      '\n' +
      '  set someAccessor(value) {\n' +
      '    this._some = value;\n' +
      '  }\n' +
      '}'
    );
  });

  it('should ignore other options of Object.defineProperty when converting get/set', () => {
    expect(test(
      'function MyClass() {\n' +
      '}\n' +
      'Object.defineProperty(MyClass.prototype, "someAccessor", {\n' +
      '  configurable: true,\n' +
      '  enumerable: true,\n' +
      '  set: function (value) {\n' +
      '    this._some = value;\n' +
      '  }\n' +
      '});'
    )).to.equal(
      'class MyClass {\n' +
      '  set someAccessor(value) {\n' +
      '    this._some = value;\n' +
      '  }\n' +
      '}'
    );
  });

  it('should ignore Object.defineProperty of non-function property', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}\n' +
      'Object.defineProperty(MyClass.prototype, "propName", {\n' +
      '  value: 10,\n' +
      '  configurable: true,\n' +
      '  writable: true\n' +
      '});'
    );
  });

  it('should ignore Object.defineProperty with arrow-function', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}\n' +
      'Object.defineProperty(MyClass.prototype, "getter", {\n' +
      '  get: () => this.something\n' +
      '});'
    );
  });

});
