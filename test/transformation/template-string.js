var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer();

describe('Template string transformation', function () {

  it('should not convert non-concatenated strings', function (done) {
    var script = "var result = 'test';";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
    done();
  });

  it('should not convert non-string binary expressions with + operator', function (done) {
    var script = "var result = 1 + 2;";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
    done();
  });

  it('should not convert only string concatenation', function (done) {
    var script = "var result = 'Hello ' + ' World!';";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('var result = `Hello  World!`;');
    done();
  });

  it('should convert string and one variable concatenation', function (done) {
    var script = "var result = 'Firstname: ' + firstname;";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('var result = `Firstname: ${ firstname }`;');
    done();
  });

  it('should convert string and multiple variables concatenation', function (done) {
    var script = "var result = 'Fullname: ' + firstname + lastname;";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('var result = `Fullname: ${ firstname }${ lastname }`;');

    done();
  });

  it('should convert string and call expressions', function (done) {
    var script = "var result = 'Firstname: ' + person.getFirstname() + 'Lastname: ' + person.getLastname();";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal('var result = `Firstname: ${ person.getFirstname() }Lastname: ${ person.getLastname() }`;');

    done();
  });

});
