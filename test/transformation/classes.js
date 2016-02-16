var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({classes: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Class transformation', function () {

  it('should not convert functions without prototype assignment to class', function () {
    var script = "function someClass() {\n}";

    expect(test(script)).to.equal(script);
  });

  it('should convert functions with prototype assignment to class', function () {
    expect(test(
      "function someClass() {\n" +
      "}\n" +
      "someClass.prototype.someMethod = function(a, b) {\n" +
      "};"
    )).to.equal(
      "class someClass {\n" +
      "  someMethod(a, b) {\n" +
      "  }\n" +
      "}"
    );
  });

  it('should convert non-empty function to constructor method', function () {
    expect(test(
      "function someClass(a, b) {\n" +
      "  this.params = [a, b];\n" +
      "}\n" +
      "someClass.prototype.someMethod = function(ma, mb) {\n" +
      "};"
    )).to.equal(
      "class someClass {\n" +
      "  constructor(a, b) {\n" +
      "    this.params = [a, b];\n" +
      "  }\n" +
      "\n" +
      "  someMethod(ma, mb) {\n" +
      "  }\n" +
      "}"
    );
  });

  it('should not convert non-anonymous functions to methods', function () {
    expectNoChange(
      "function someClass() {\n" +
      "}\n" +
      "someClass.prototype.someMethod = someMethod;\n" +
      "function someMethod(a, b) {\n" +
      "}"
    );
  });

  it('should convert Object.defineProperty to setters and getters', function () {
    expect(test(
      "function someClass() {\n" +
      "}\n" +
      "someClass.prototype.someMethod = function(a, b) {\n" +
      "};\n" +
      "Object.defineProperty(someClass.prototype, 'someAccessor', {\n" +
      "  get: function () {\n" +
      "    return this._some;\n" +
      "  },\n" +
      "  set: function (value) {\n" +
      "    this._some = value;\n" +
      "  }\n" +
      "});"
    )).to.equal(
      "class someClass {\n" +
      "  someMethod(a, b) {\n" +
      "  }\n" +
      "\n" +
      "  get someAccessor() {\n" +
      "    return this._some;\n" +
      "  }\n" +
      "\n" +
      "  set someAccessor(value) {\n" +
      "    this._some = value;\n" +
      "  }\n" +
      "}"
    );
  });

});
