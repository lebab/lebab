import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'template': true});

function test(script) {
  return transformer.run(script);
}

describe('Template string', () => {

  it('shouldn\'t convert non-concatenated strings', () => {
    const script = 'var result = "test";';

    expect(test(script)).to.equal(script);
  });

  it('shouldn\'t convert non-string binary expressions with + operator', () => {
    const script = 'var result = 1 + 2;';

    expect(test(script)).to.equal(script);
  });

  it('shouldn\'t convert only string concatenation', () => {
    const script = 'var result = "Hello " + " World!";';

    expect(test(script)).to.equal('var result = `Hello  World!`;');
  });

  it('should convert string and one variable concatenation', () => {
    const script = 'var result = "Firstname: " + firstname;';

    expect(test(script)).to.equal('var result = `Firstname: ${firstname}`;');
  });

  it('should convert string and multiple variables concatenation', () => {
    const script = 'var result = "Fullname: " + firstname + lastname;';

    expect(test(script)).to.equal('var result = `Fullname: ${firstname}${lastname}`;');
  });

  it('should convert string and call expressions', () => {
    const script = 'var result = "Firstname: " + person.getFirstname() + "Lastname: " + person.getLastname();';

    expect(test(script)).to.equal('var result = `Firstname: ${person.getFirstname()}Lastname: ${person.getLastname()}`;');
  });

  it('should escape ` characters', () => {
    const script = 'var result = "Firstname: `" + firstname + "`";';

    expect(test(script)).to.equal('var result = `Firstname: \\`${firstname}\\``;');
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
