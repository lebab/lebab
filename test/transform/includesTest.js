import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['includes']);

describe('indexOf() to includes()', () => {
  it('should replace !== -1 with includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) !== -1) { /* */ }'
    ).toReturn(
      'if (array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform !== 0', () => {
    expectNoChange(
      'if (array.indexOf(foo) !== 0) { /* */ }'
    );
  });

  it('should replace === -1 with !includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) === -1) { /* */ }'
    ).toReturn(
      'if (!array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform === 0', () => {
    expectNoChange(
      'if (array.indexOf(foo) === 0) { /* */ }'
    );
  });

  it('should replace != -1 with includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) != -1) { /* */ }'
    ).toReturn(
      'if (array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform != 0', () => {
    expectNoChange(
      'if (array.indexOf(foo) != 0) { /* */ }'
    );
  });

  it('should replace == -1 with !includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) == -1) { /* */ }'
    ).toReturn(
      'if (!array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform == 0', () => {
    expectNoChange(
      'if (array.indexOf(foo) == 0) { /* */ }'
    );
  });

  it('should replace > -1 with includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) > -1) { /* */ }'
    ).toReturn(
      'if (array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform > 0', () => {
    expectNoChange(
      'if (array.indexOf(foo) > 0) { /* */ }'
    );
  });

  it('should NOT transform >= -1', () => {
    expectNoChange(
      'if (array.indexOf(foo) >= -1) { /* */ }'
    );
  });

  it('should replace >= 0 with includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) >= 0) { /* */ }'
    ).toReturn(
      'if (array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform < -1', () => {
    expectNoChange(
      'if (array.indexOf(foo) < -1) { /* */ }'
    );
  });

  it('should replace < 0 with !includes()', () => {
    expectTransform(
      'if (array.indexOf(foo) < 0) { /* */ }'
    ).toReturn(
      'if (!array.includes(foo)) { /* */ }'
    );
  });

  it('should NOT transform <= -1', () => {
    expectNoChange(
      'if (array.indexOf(foo) <= -1) { /* */ }'
    );
  });

  it('should NOT transform <= 0', () => {
    expectNoChange(
      'if (array.indexOf(foo) <= 0) { /* */ }'
    );
  });

  describe('reversed operands', () => {
    it('should transform -1 !== indexOf()', () => {
      expectTransform(
        'if (-1 !== array.indexOf(foo)) { /* */ }'
      ).toReturn(
        'if (array.includes(foo)) { /* */ }'
      );
    });

    it('should transform -1 === indexOf()', () => {
      expectTransform(
        'if (-1 === array.indexOf(foo)) { /* */ }'
      ).toReturn(
        'if (!array.includes(foo)) { /* */ }'
      );
    });

    it('should transform -1 < indexOf()', () => {
      expectTransform(
        'if (-1 < array.indexOf(foo)) { /* */ }'
      ).toReturn(
        'if (array.includes(foo)) { /* */ }'
      );
    });

    it('should transform 0 <= indexOf()', () => {
      expectTransform(
        'if (0 <= array.indexOf(foo)) { /* */ }'
      ).toReturn(
        'if (array.includes(foo)) { /* */ }'
      );
    });

    it('should transform 0 > indexOf()', () => {
      expectTransform(
        'if (0 > array.indexOf(foo)) { /* */ }'
      ).toReturn(
        'if (!array.includes(foo)) { /* */ }'
      );
    });

    it('should NOT transform 0 >= indexOf()', () => {
      expectNoChange(
        'if (0 >= array.indexOf(foo)) { /* */ }'
      );
    });
  });

  describe('additional checks', () => {
    it('should allow complex array expression', () => {
      expectTransform(
        'if ([1,2,3].indexOf(foo) !== -1) { /* */ }'
      ).toReturn(
        'if ([1,2,3].includes(foo)) { /* */ }'
      );
    });

    it('should allow complex string expression', () => {
      expectTransform(
        'if (("foo" + "bar").indexOf(foo) !== -1) { /* */ }'
      ).toReturn(
        'if (("foo" + "bar").includes(foo)) { /* */ }'
      );
    });

    it('should allow complex searchElement expression', () => {
      expectTransform(
        'if (array.indexOf(a + b + c) !== -1) { /* */ }'
      ).toReturn(
        'if (array.includes(a + b + c)) { /* */ }'
      );
    });

    it('should NOT transform indexOf() with multiple parameters', () => {
      expectNoChange(
        'if (array.indexOf(a, b) !== -1) { /* */ }'
      );
    });
  });
});
