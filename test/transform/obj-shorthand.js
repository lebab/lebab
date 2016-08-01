import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['obj-shorthand']);

describe('Object shorthands', () => {
  it('should convert matching key-value entries to shorthand notation', () => {
    expectTransform('({foo: foo})').toReturn('({foo})');
  });

  it('should not convert non-matching key-value entries to shorthand notation', () => {
    expectNoChange('({foo: bar})');
  });

  it('should not convert numeric properties to shorthands', () => {
    expectNoChange('({10: 10})');
  });

  // One might think we should also convert strings,
  // but there might be some explicit reason why author chose
  // to write his property names as strings,
  // like when using Advanced compilation mode of Google Closure Compiler,
  // where string keys signify that they should not be minified.
  it('should not convert string properties to shorthands', () => {
    expectNoChange('({"foo": foo})');
  });
});
