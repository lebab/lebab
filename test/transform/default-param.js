import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers({'default-param': true});

describe('Default parameters', () => {
  describe('detected from or-assignment', () => {
    it('should work for simple case', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = a || 2;\n' +
        '}'
      ).toReturn(
        'function x(a=2) {}'
      );
    });

    it('should work for different types of parameters', () => {
      expectTransform(
        'function x(a, b, c) {\n' +
        '  a = a || "salam";\n' +
        '  b = b || {};\n' +
        '  c = c || [];\n' +
        '}'
      ).toReturn(
        'function x(a="salam", b={}, c=[]) {}'
      );
    });

    it('should not work when variable not in left of ||', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = 10 || a;\n' +
        '}'
      );
    });
  });

  describe('detected from ternary-assignment', () => {
    it('should work for simple case', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = a ? a : 4;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for different types of parameters', () => {
      expectTransform(
        'function x(a, b, c) {\n' +
        '  a = a ? a : "salam";\n' +
        '  b = b ? b : {};\n' +
        '  c = c ? c : [];\n' +
        '}'
      ).toReturn(
        'function x(a="salam", b={}, c=[]) {}'
      );
    });

    it('should not work when variable in alternate position', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = a ? 5 : a;\n' +
        '}'
      );
    });
  });

  describe('detected from equals-undefined assignment', () => {
    it('should work for ===', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = a === undefined ? 4 : a;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for !==', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = a !== undefined ? a : 4;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for ==', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = a == undefined ? 4 : a;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for !=', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = a != undefined ? a : 4;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should not work for other operators (like >)', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = a > undefined ? a : 4;\n' +
        '}'
      );
    });

    it('should not work for === when variable in wrong location', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = a === undefined ? a : 5;\n' +
        '}'
      );
    });

    it('should not work for !== when variable in wrong location', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = a !== undefined ? 5 : a;\n' +
        '}'
      );
    });
  });

  describe('detected from typeof equals-undefined assignment', () => {
    it('should work for ===', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = typeof a === "undefined" ? 4 : a;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for !==', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = typeof a !== "undefined" ? a : 4;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for ==', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = typeof a == "undefined" ? 4 : a;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should work for !=', () => {
      expectTransform(
        'function x(a) {\n' +
        '  a = typeof a != "undefined" ? a : 4;\n' +
        '}'
      ).toReturn(
        'function x(a=4) {}'
      );
    });

    it('should not work for other operators (like >)', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = typeof a > undefined ? a : 4;\n' +
        '}'
      );
    });

    it('should not work for === when variable in wrong location', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = typeof a === "undefined" ? a : 5;\n' +
        '}'
      );
    });

    it('should not work for !== when variable in wrong location', () => {
      expectNoChange(
        'function x(a) {\n' +
        '  a = typeof a !== "undefined" ? 5 : a;\n' +
        '}'
      );
    });
  });

  it('should work when only some parameters have defaults', () => {
    expectTransform(
      'function x(a, b, c) {\n' +
      '  b = b || 3;\n' +
      '}'
    ).toReturn(
      'function x(a, b=3, c) {}'
    );
  });

  it('should work for multiple functions', () => {
    expectTransform(
      'function x(a) { a = a || 2; }\n' +
      'function y(a) { a = a || 3; }'
    ).toReturn(
      'function x(a=2) {}\n' +
      'function y(a=3) {}'
    );
  });

  it('should work for nested functions with similar parameter names', () => {
    expectTransform(
      'function x(a) {\n' +
      '  function y(a) {\n' +
      '    a = a || 3;\n' +
      '  }\n' +
      '  a = a || 2;\n' +
      '}'
    ).toReturn(
      'function x(a) {\n' +
      '  function y(a=3) {}\n' +
      '  a = a || 2;\n' +
      '}'
    );
  });

  it('should ignore parameters modified before assigning default', () => {
    expectNoChange(
      'function x(a) {\n' +
      '  a = foo();\n' +
      '  a = a || 2;\n' +
      '}'
    );
  });

  it('should ignore parameters when any other code executed before assigning default', () => {
    expectNoChange(
      'function x(a) {\n' +
      '  foo();\n' +
      '  a = a || 2;\n' +
      '  function foo() {\n' +
      '    a++;\n' +
      '  }\n' +
      '}'
    );
  });

  it('should work for function expressions', () => {
    expectTransform(
      'foo(function(a) {\n' +
      '  a = a || 2;\n' +
      '});'
    ).toReturn(
      'foo(function(a=2) {});'
    );
  });

  // Unable to make arrow functions work (so disabling them instead)
  // Seems to be a bug in Recast
  // https://github.com/benjamn/recast/issues/260
  it('should not work for arrow functions', () => {
    expectNoChange(
      'foo((a) => {\n' +
      '  a = a || 2;\n' +
      '});'
    );
  });

  it('should preserve existing default parameters', () => {
    expectNoChange(
      'function x(a="salam", b={}, c=[]) {}'
    );
  });

  it('should not override existing default parameters', () => {
    expectNoChange(
      'function x(a=25) {\n' +
      '  a = a || 2;\n' +
      '}'
    );
  });

  // Regression test for issue #89
  it('should preserve long parameter lists as is when there are no defaults', () => {
    expectNoChange(
      'function foo(variable1, variable2, variable3, variable4, variable5, variable6, variable7, variable8) {}'
    );
  });
});
