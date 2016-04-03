import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'template': true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Template string', () => {
  it('should not convert non-concatenated strings', () => {
    expectNoChange('var result = "test";');
  });

  it('should not convert non-string binary expressions with + operator', () => {
    expectNoChange('var result = 1 + 2;');
    expectNoChange('var result = a + b;');
  });

  it('should not convert only string concatenation', () => {
    expectNoChange('var result = "Hello " + " World!";');
  });

  it('should convert string and one variable concatenation', () => {
    expect(test(
      'var result = "Firstname: " + firstname;'
    )).to.equal(
      'var result = `Firstname: ${firstname}`;'
    );
  });

  it('should convert string and multiple variables concatenation', () => {
    expect(test(
      'var result = "Fullname: " + firstname + lastname;'
    )).to.equal(
      'var result = `Fullname: ${firstname}${lastname}`;'
    );
  });

  it('should convert parenthized string concatenations', () => {
    expect(test(
      '"str1 " + (x + " str2");'
    )).to.equal(
      '`str1 ${x} str2`;'
    );
  });

  it('should convert parenthized string concatenations and other concatenations', () => {
    expect(test(
      'x + " str1 " + (y + " str2");'
    )).to.equal(
      '`${x} str1 ${y} str2`;'
    );
  });

  it('should convert parenthized non-string concatenations', () => {
    expect(test(
      '(x + y) + " string " + (a + b);'
    )).to.equal(
      '`${x + y} string ${a + b}`;'
    );
  });

  it('should convert non-parenthized non-string concatenations', () => {
    expect(test(
      'x + y + " string " + a + b;'
    )).to.equal(
      '`${x + y} string ${a}${b}`;'
    );
  });

  it('should convert string and call expressions', () => {
    expect(test(
      'var result = "Firstname: " + person.getFirstname() + "Lastname: " + person.getLastname();'
    )).to.equal(
      'var result = `Firstname: ${person.getFirstname()}Lastname: ${person.getLastname()}`;'
    );
  });

  it('should convert string and number literals', () => {
    expect(test(
      '"foo " + 25 + " bar";'
    )).to.equal(
      '`foo ${25} bar`;'
    );
  });

  it('should convert string and member-expressions', () => {
    expect(test(
      '"foo " + foo.bar + " bar";'
    )).to.equal(
      '`foo ${foo.bar} bar`;'
    );
  });

  it('should escape ` characters', () => {
    expect(test(
      'var result = "Firstname: `" + firstname + "`";'
    )).to.equal(
      'var result = `Firstname: \\`${firstname}\\``;'
    );
  });

  it('should leave \\t, \\r, \\n, \\v, \\f, \\b, \\0, \\\\ escaped as is', () => {
    expect(test('x = "\\t" + y;')).to.equal('x = `\\t${y}`;');
    expect(test('x = "\\r" + y;')).to.equal('x = `\\r${y}`;');
    expect(test('x = "\\n" + y;')).to.equal('x = `\\n${y}`;');
    expect(test('x = "\\v" + y;')).to.equal('x = `\\v${y}`;');
    expect(test('x = "\\f" + y;')).to.equal('x = `\\f${y}`;');
    expect(test('x = "\\b" + y;')).to.equal('x = `\\b${y}`;');
    expect(test('x = "\\0" + y;')).to.equal('x = `\\0${y}`;');
    expect(test('x = "\\\\" + y;')).to.equal('x = `\\\\${y}`;');
  });

  it('should leave octal-, hex-, unicode-escapes as is', () => {
    expect(test('x = "\\251" + y;')).to.equal('x = `\\251${y}`;');
    expect(test('x = "\\xA9" + y;')).to.equal('x = `\\xA9${y}`;');
    expect(test('x = "\\u00A9" + y;')).to.equal('x = `\\u00A9${y}`;');
  });

  it('should eliminate escaping of quotes', () => {
    expect(test('x = "\\\'" + y;')).to.equal('x = `\'${y}`;');
    expect(test('x = "\\"" + y;')).to.equal('x = `"${y}`;');
  });
});
