import createTestHelpers from '../createTestHelpers';
const {expectTransform} = createTestHelpers([
  'class',
  'template',
  'arrow',
  'let',
  'default-param',
  'arg-spread',
  'obj-method',
  'obj-shorthand',
  'no-strict',
  'commonjs',
  'exponent',
]);

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

  it('should preserve #! comment using CRLF', () => {
    expectTransform(
      '#!/usr/bin/env node\r\n' +
      'var x = 42;'
    ).toReturn(
      '#!/usr/bin/env node\r\n' +
      'const x = 42;'
    );
  });

  it('should preserve CRLF line terminators', () => {
    expectTransform(
      'var f = function(x) {\r\n' +
      '  if (x > 10)\r\n' +
      '    return 42;\r\n' +
      '};'
    ).toReturn(
      'const f = x => {\r\n' +
      '  if (x > 10)\r\n' +
      '    return 42;\r\n' +
      '};'
    );
  });

  it('should use LF in case of mixed line terminators', () => {
    expectTransform(
      'var f = function(x) {\n' +
      '  if (x > 10)\r\n' +
      '    return 42;\r\n' +
      '};'
    ).toReturn(
      'const f = x => {\n' +
      '  if (x > 10)\n' +
      '    return 42;\n' +
      '};'
    );
  });
});
