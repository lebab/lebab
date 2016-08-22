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

describe('JSX support', () => {
  it('should support self-closing element', () => {
    expectTransform(
      'var foo = <div/>;'
    ).toReturn(
      'const foo = <div/>;'
    );
  });

  it('should support attributes', () => {
    expectTransform(
      'var foo = <div foo="hello" bar={2}/>;'
    ).toReturn(
      'const foo = <div foo="hello" bar={2}/>;'
    );
  });

  it('should support spread attributes', () => {
    expectTransform(
      'var foo = <div {...attrs}/>;'
    ).toReturn(
      'const foo = <div {...attrs}/>;'
    );
  });

  it('should support nested elements', () => {
    expectTransform(
      'var foo = <div>\n' +
      '    <Foo/>\n' +
      '    <Bar/>\n' +
      '</div>;'
    ).toReturn(
      'const foo = <div>\n' +
      '    <Foo/>\n' +
      '    <Bar/>\n' +
      '</div>;'
    );
  });

  it('should support member-expressions as element name', () => {
    expectTransform(
      'var foo = <Foo.bar/>;'
    ).toReturn(
      'const foo = <Foo.bar/>;'
    );
  });

  it('should support XML namespaces', () => {
    expectTransform(
      'var foo = <xml:foo/>;'
    ).toReturn(
      'const foo = <xml:foo/>;'
    );
  });

  it('should support content', () => {
    expectTransform(
      'var foo = <div>Hello {a + b}</div>;'
    ).toReturn(
      'const foo = <div>Hello {a + b}</div>;'
    );
  });

  it('should support empty content expressions', () => {
    expectTransform(
      'var foo = <div> {/* some comments */} </div>;'
    ).toReturn(
      'const foo = <div> {/* some comments */} </div>;'
    );
  });
});
