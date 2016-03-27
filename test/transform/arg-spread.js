import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'arg-spread': true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Arguments apply() to spread', () => {
  it('should convert basic obj.fn.apply()', () => {
    expect(test(
      'obj.fn.apply(obj, someArray);'
    )).to.equal(
      'obj.fn(...someArray);'
    );
  });

  it('should convert this.method.apply()', () => {
    expect(test(
      'this.method.apply(this, someArray);'
    )).to.equal(
      'this.method(...someArray);'
    );
  });

  it('should not convert obj.fn.apply() without obj as parameter', () => {
    expectNoChange('obj.fn.apply(otherObj, someArray);');
    expectNoChange('obj.fn.apply(undefined, someArray);');
    expectNoChange('obj.fn.apply(null, someArray);');
    expectNoChange('obj.fn.apply(this, someArray);');
    expectNoChange('obj.fn.apply({}, someArray);');
  });

  it('should not convert plain fn.apply()', () => {
    expectNoChange('fn.apply(obj, someArray);');
    expectNoChange('fn.apply(this, someArray);');
    expectNoChange('fn.apply(null, someArray);');
  });

  it('should convert obj.fn.apply() with array expression', () => {
    expect(test(
      'obj.fn.apply(obj, [1, 2, 3]);'
    )).to.equal(
      'obj.fn(...[1, 2, 3]);'
    );
  });

  it('should convert <long-expression>.fn.apply()', () => {
    expect(test(
      'foo[bar+1].baz.fn.apply(foo[bar+1].baz, someArray);'
    )).to.equal(
      'foo[bar+1].baz.fn(...someArray);'
    );
  });

  it('should convert <literal>.fn.apply()', () => {
    expect(test(
      '[].fn.apply([], someArray);'
    )).to.equal(
      '[].fn(...someArray);'
    );
  });

  it('should convert obj[fn].apply()', () => {
    expect(test(
      'obj[fn].apply(obj, someArray);'
    )).to.equal(
      'obj[fn](...someArray);'
    );
  });
});
