import createTestHelpers from '../createTestHelpers';
const {expectTransform} = createTestHelpers({
  'class': true,
  'template': true,
  'arrow': true,
  'let': true,
  'default-param': true,
  'arg-spread': true,
  'obj-method': true,
  'obj-shorthand': true,
  'no-strict': true,
  'commonjs': true,
  'exponent': true,
});

describe('Whitespace', () => {
  it('should not eliminate leading newlines', () => {
    expectTransform(
      '\n\nvar x = 42;'
    ).toReturn(
      '\n\nconst x = 42;'
    );
  });

  it('should not eliminate trailing newlines', () => {
    expectTransform(
      'var x = 42;\n\n'
    ).toReturn(
      'const x = 42;\n\n'
    );
  });

  it('ignores #! comment at the beginning of file', () => {
    expectTransform(
      '#!/usr/bin/env node\n' +
      'var x = 42;'
    ).toReturn(
      '#!/usr/bin/env node\n' +
      'const x = 42;'
    );
  });

  it('ignores #! comment almost at the beginning of file', () => {
    expectTransform(
      '\n' +
      '#!/usr/local/bin/node\n' +
      'if (true) {\n' +
      '  var foo = 42;\n' +
      '}'
    ).toReturn(
      '\n' +
      '#!/usr/local/bin/node\n' +
      'if (true) {\n' +
      '  const foo = 42;\n' +
      '}'
    );
  });
});
