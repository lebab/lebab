var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer({stringTemplates: true});

function test(script) {
  return transformer.run(script);
}

describe('Template string transformation', function () {

  it('shouldn\'t convert non-concatenated strings', function () {
    var script = "var result = 'test';";

    expect(test(script)).to.equal(script);
  });

  it('shouldn\'t convert non-string binary expressions with + operator', function () {
    var script = "var result = 1 + 2;";

    expect(test(script)).to.equal(script);
  });

  it('shouldn\'t convert only string concatenation', function () {
    var script = "var result = 'Hello ' + ' World!';";

    expect(test(script)).to.equal('var result = `Hello  World!`;');
  });

  it('should convert string and one variable concatenation', function () {
    var script = "var result = 'Firstname: ' + firstname;";

    expect(test(script)).to.equal('var result = `Firstname: ${firstname}`;');
  });

  it('should convert string and multiple variables concatenation', function () {
    var script = "var result = 'Fullname: ' + firstname + lastname;";

    expect(test(script)).to.equal('var result = `Fullname: ${firstname}${lastname}`;');
  });

  it('should convert string and call expressions', function () {
    var script = "var result = 'Firstname: ' + person.getFirstname() + 'Lastname: ' + person.getLastname();";

    expect(test(script)).to.equal('var result = `Firstname: ${person.getFirstname()}Lastname: ${person.getLastname()}`;');
  });

  it('should escape ` characters', function () {
    var script = "var result = 'Firstname: `' + firstname + '`';";

    expect(test(script)).to.equal('var result = `Firstname: \\`${firstname}\\``;');
  });

  it('should leave \\t, \\r, \\n, \\v, \\f, \\b, \\0, \\\\ escaped as is', function () {
    expect(test("x = '\\t' + y;")).to.equal('x = `\\t${y}`;');
    expect(test("x = '\\r' + y;")).to.equal('x = `\\r${y}`;');
    expect(test("x = '\\n' + y;")).to.equal('x = `\\n${y}`;');
    expect(test("x = '\\v' + y;")).to.equal('x = `\\v${y}`;');
    expect(test("x = '\\f' + y;")).to.equal('x = `\\f${y}`;');
    expect(test("x = '\\b' + y;")).to.equal('x = `\\b${y}`;');
    expect(test("x = '\\0' + y;")).to.equal('x = `\\0${y}`;');
    expect(test("x = '\\\\' + y;")).to.equal('x = `\\\\${y}`;');
  });

  it('should leave octal-, hex-, unicode-escapes as is', function () {
    expect(test("x = '\\251' + y;")).to.equal('x = `\\251${y}`;');
    expect(test("x = '\\xA9' + y;")).to.equal('x = `\\xA9${y}`;');
    expect(test("x = '\\u00A9' + y;")).to.equal('x = `\\u00A9${y}`;');
  });

  it('should eliminate escaping of quotes', function () {
    expect(test("x = '\\'' + y;")).to.equal("x = `'${y}`;");
    expect(test('x = "\\"" + y;')).to.equal('x = `"${y}`;');
  });
});
