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
  'exponent': true,
});

function test(script) {
  return transformer.run(script);
}

describe('JSX support', () => {
  it('should support self-closing element', () => {
    expect(test(
      'var foo = <div/>;'
    )).to.equal(
      'const foo = <div/>;'
    );
  });

  it('should support attributes', () => {
    expect(test(
      'var foo = <div foo="hello" bar={2}/>;'
    )).to.equal(
      'const foo = <div foo="hello" bar={2}/>;'
    );
  });

  it('should support spread attributes', () => {
    expect(test(
      'var foo = <div {...attrs}/>;'
    )).to.equal(
      'const foo = <div {...attrs}/>;'
    );
  });

  it('should support nested elements', () => {
    expect(test(
      'var foo = <div>\n' +
      '    <Foo/>\n' +
      '    <Bar/>\n' +
      '</div>;'
    )).to.equal(
      'const foo = <div>\n' +
      '    <Foo/>\n' +
      '    <Bar/>\n' +
      '</div>;'
    );
  });

  it('should support member-expressions as element name', () => {
    expect(test(
      'var foo = <Foo.bar/>;'
    )).to.equal(
      'const foo = <Foo.bar/>;'
    );
  });

  it('should support XML namespaces', () => {
    expect(test(
      'var foo = <xml:foo/>;'
    )).to.equal(
      'const foo = <xml:foo/>;'
    );
  });

  it('should support content', () => {
    expect(test(
      'var foo = <div>Hello {a + b}</div>;'
    )).to.equal(
      'const foo = <div>Hello {a + b}</div>;'
    );
  });

  it('should support empty content expressions', () => {
    expect(test(
      'var foo = <div> {/* some comments */} </div>;'
    )).to.equal(
      'const foo = <div> {/* some comments */} </div>;'
    );
  });
});
