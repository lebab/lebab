var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({class: true});

function test(script) {
  return transformer.run(script);
}

describe('Class transformation', function () {

  it('shouldn\'t convert functions without prototype assignment to class', function () {
    var script = "function someClass() {\n}";

    expect(test(script)).to.equal(script);
  });

  it('should convert functions with prototype assignment to class', function () {
    var script = "function someClass() {\n}\nsomeClass.prototype.someMethod = function(a, b) {\n}";

    var result = test(script);

    expect(result).to.include('class someClass');
    expect(result).to.include('someMethod(a, b)');
  });

  it('should apply non-anonymous functions to methods', function () {
    var script = "function someClass() {\n}\nsomeClass.prototype.someMethod = someMethod\nfunction someMethod(a, b) {\n}";

    var result = test(script);

    expect(result).to.include('class someClass');
    expect(result).to.include('someMethod(a, b)');
    expect(result).to.include('someMethod.apply(this, arguments)');
  });

  it('should convert Object.defineProperty to setters and getters', function () {
    var script = "function someClass() {\n}\nsomeClass.prototype.someMethod = function (a, b) {\n}\nObject.defineProperty(someClass.prototype, 'someAccessor', {\nget: function () {\nreturn this._some;\n},\nset: function (value) {\nthis._some = value;\n}\n});";

    var result = test(script);

    expect(result).to.include('class someClass');
    expect(result).to.include('someMethod(a, b)');
    expect(result).to.include('get someAccessor()');
    expect(result).to.include('set someAccessor(value)');
  });

  it('should not forget to copy over Class constructor arguments after transforming', function () {
    var script = 'function someClass(a, b) {\n}\nsomeClass.prototype.someMethod = function(ma, mb) {\n}';

    var result = test(script);

    expect(result).to.include('constructor(a, b)');
    expect(result).to.include('someMethod(ma, mb)');
  });

});
