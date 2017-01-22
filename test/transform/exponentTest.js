import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['exponent']);

describe('Exponentiation operator', () => {
  it('should convert Math.pow()', () => {
    expectTransform(
      'result = Math.pow(a, b);'
    ).toReturn(
      'result = a ** b;'
    );
  });

  it('should parenthesize arguments when needed', () => {
    expectTransform(
      'result = Math.pow(a + 1, b + 2);'
    ).toReturn(
      'result = (a + 1) ** (b + 2);'
    );
  });

  // Issue #196
  it.skip('should parenthesize multiplication', () => {
    expectTransform(
      'Math.pow(x * 2, 2);'
    ).toReturn(
      '(x * 2) ** 2;'
    );
  });

  it('should not convert Math.pow() without exactly two arguments', () => {
    expectNoChange('Math.pow();');
    expectNoChange('Math.pow(1);');
    expectNoChange('Math.pow(1, 2, 3);');
  });
});
