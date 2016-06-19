import createTestHelpers from '../createTestHelpers';
const {expect, test, expectNoChange} = createTestHelpers({'exponent': true});

describe('Exponentiation operator', () => {
  it('should convert Math.pow()', () => {
    expect(test(
      'result = Math.pow(a, b);'
    )).to.equal(
      'result = a ** b;'
    );
  });

  it('should parenthesize arguments when needed', () => {
    expect(test(
      'result = Math.pow(a + 1, b + 2);'
    )).to.equal(
      'result = (a + 1) ** (b + 2);'
    );
  });

  it('should not convert Math.pow() without exactly two arguments', () => {
    expectNoChange('Math.pow();');
    expectNoChange('Math.pow(1);');
    expectNoChange('Math.pow(1, 2, 3);');
  });
});
