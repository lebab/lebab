var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer();

describe('Class transformation', function () {

  it('shouldn\'t convert functions without prototype assignment to class', function (done) {
    var script = "function someClass() {\n}";

    transformer.read(script);
    transformer.applyTransformations();

    expect(transformer.out()).to.equal(script);
    done();
  });

  it('should convert functions with prototype assignment to class', function (done) {
    var script = "function someClass() {\n}\nsomeClass.prototype.someMethod = function(a, b) {\n}";

    transformer.read(script);
    transformer.applyTransformations();
    var result = transformer.out();

    expect(result).to.include('class someClass');
    expect(result).to.include('someMethod(a, b)');
    done();
  });

  it('should apply non-anonymous functions to methods', function (done) {
    var script = "function someClass() {\n}\nsomeClass.prototype.someMethod = someMethod\nfunction someMethod(a, b) {\n}";

    transformer.read(script);
    transformer.applyTransformations();
    var result = transformer.out();

    expect(result).to.include('class someClass');
    expect(result).to.include('someMethod(a, b)');
    expect(result).to.include('someMethod.apply(this, arguments)');
    done();
  });

  it('should convert Object.defineProperty to setters and getters', function (done) {
    var script = "function someClass() {\n}\nsomeClass.prototype.someMethod = function (a, b) {\n}\nObject.defineProperty(someClass.prototype, 'someAccessor', {\nget: function () {\nreturn this._some;\n},\nset: function (value) {\nthis._some = value;\n}\n});";

    transformer.read(script);
    transformer.applyTransformations();
    var result = transformer.out();

    expect(result).to.include('class someClass');
    expect(result).to.include('someMethod(a, b)');
    expect(result).to.include('get someAccessor()');
    expect(result).to.include('set someAccessor(value)');
    done();
  });

});