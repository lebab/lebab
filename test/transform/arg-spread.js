import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['arg-spread']);

describe('Arguments apply() to spread', () => {
  it('should convert basic obj.fn.apply()', () => {
    expectTransform(
      'obj.fn.apply(obj, someArray);'
    ).toReturn(
      'obj.fn(...someArray);'
    );
  });

  it('should convert this.method.apply()', () => {
    expectTransform(
      'this.method.apply(this, someArray);'
    ).toReturn(
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

  it('should convert plain fn.apply()', () => {
    expectTransform('fn.apply(undefined, someArray);').toReturn('fn(...someArray);');
    expectTransform('fn.apply(null, someArray);').toReturn('fn(...someArray);');
  });

  it('should not convert plain fn.apply() when actual object used as this parameter', () => {
    expectNoChange('fn.apply(obj, someArray);');
    expectNoChange('fn.apply(this, someArray);');
    expectNoChange('fn.apply({}, someArray);');
  });

  it('should convert obj.fn.apply() with array expression', () => {
    expectTransform(
      'obj.fn.apply(obj, [1, 2, 3]);'
    ).toReturn(
      'obj.fn(...[1, 2, 3]);'
    );
  });

  it('should convert <long-expression>.fn.apply()', () => {
    expectTransform(
      'foo[bar+1].baz.fn.apply(foo[bar+1].baz, someArray);'
    ).toReturn(
      'foo[bar+1].baz.fn(...someArray);'
    );
  });

  it('should convert <literal>.fn.apply()', () => {
    expectTransform(
      '[].fn.apply([], someArray);'
    ).toReturn(
      '[].fn(...someArray);'
    );
  });

  it('should convert obj[fn].apply()', () => {
    expectTransform(
      'obj[fn].apply(obj, someArray);'
    ).toReturn(
      'obj[fn](...someArray);'
    );
  });
});
