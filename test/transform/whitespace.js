import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({
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
});

function test(script) {
  return transformer.run(script);
}

describe('Whitespace', () => {
  it('should not eliminate leading newlines', () => {
    expect(test(
      '\n\nvar x = 42;'
    )).to.equal(
      '\n\nconst x = 42;'
    );
  });

  it('should not eliminate trailing newlines', () => {
    expect(test(
      'var x = 42;\n\n'
    )).to.equal(
      'const x = 42;\n\n'
    );
  });

  it('ignores #! comment at the beginning of file', () => {
    expect(test(
      '#!/usr/bin/env node\n' +
      'var x = 42;'
    )).to.equal(
      '#!/usr/bin/env node\n' +
      'const x = 42;'
    );
  });

  it('ignores #! comment almost at the beginning of file', () => {
    expect(test(
      '\n' +
      '#!/usr/local/bin/node\n' +
      'if (true) {\n' +
      '  var foo = 42;\n' +
      '}'
    )).to.equal(
      '\n' +
      '#!/usr/local/bin/node\n' +
      'if (true) {\n' +
      '  const foo = 42;\n' +
      '}'
    );
  });
});
