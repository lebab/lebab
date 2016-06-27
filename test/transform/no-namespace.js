import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'no-namespace': true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe.only('Removal of namespaces', () => {
  it('should remain non-named functions as-is', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}'
    );
  });

  it('should remove namespace from a namespaced function constructor', () => {
    expect(test(
      'MyNamespace.MyClass = function(a, b) {\n' +
      '};'
    )).to.equal(
      'function MyClass(a, b) {\n' +
      '}'
    );
  });

  it('should remove namespace from a namespaced method', () => {
    expect(test(
      'MyNamespace.MyClass.prototype.myFunc = function(a, b) {\n' +
      '};'
    )).to.equal(
      'MyClass.prototype.myFunc = function(a, b) {\n' +
      '};'
    );
  });

  it('should remove namespace from a namespaced static method', () => {
    expect(test(
      'MyNamespace.MyClass.myFunc = function(a, b) {\n' +
      '};'
    )).to.equal(
      'MyClass.myFunc = function(a, b) {\n' +
      '};'
    );
  });

  it('should remove namespace from a doubly namespaced function constructor', () => {
    expect(test(
      'FirstNS.SecondNS.MyClass = function(a, b) {\n' +
      '};'
    )).to.equal(
      'function MyClass(a, b) {\n' +
      '}'
    );
  });

  it('should remove namespace from a doubly namespaced method', () => {
    expect(test(
      'FirstNS.SecondNS.MyClass.prototype.myFunc = function(a, b) {\n' +
      '};'
    )).to.equal(
      'MyClass.prototype.myFunc = function(a, b) {\n' +
      '};'
    );
  });

  it('should remove namespace from a doubly namespaced static method', () => {
    expect(test(
      'FirstNS.SecondNS.MyClass.myFunc = function(a, b) {\n' +
      '};'
    )).to.equal(
      'MyClass.myFunc = function(a, b) {\n' +
      '};'
    );
  });
});
