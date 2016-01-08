var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  templateTransformation = require('./../../lib/transformation/template-string'),
  transformer = new Transformer({formatter: false});

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(templateTransformation);
  return transformer.out();
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
});
