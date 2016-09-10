import createTestHelpers from '../createTestHelpers';
const {expectTransform} = createTestHelpers(['let']);

describe('Rest and Spread support', () => {
  it('should support object rest in destructuring', () => {
    expectTransform(
      'var { foo, ...other } = bar;'
    ).toReturn(
      'const { foo, ...other } = bar;'
    );
  });

  it('should support object spread', () => {
    expectTransform(
      'var foo = { bar, ...other };'
    ).toReturn(
      'const foo = { bar, ...other };'
    );
  });
});
