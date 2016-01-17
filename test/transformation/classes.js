var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({classes: true});

function test(script) {
  return transformer.run(script);
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
      "  constructor() {\n" +
      "  }\n" +
      "\n" +
      "  someMethod(a, b) {\n" +
      "  }\n" +
      "}"
    );
  });

  xit('should apply non-anonymous functions to methods', function () {
    expect(test(
      "function someClass() {\n" +
      "}\n" +
      "someClass.prototype.someMethod = someMethod;\n" +
      "function someMethod(a, b) {\n" +
      "}"
    )).to.equal(
      "class someClass {\n" +
      "  constructor() {\n" +
      "  }\n" +
      "\n" +
      "  someMethod() {\n" +
      "    return someMethod.apply(this, arguments);\n" +
      "  }\n" +
      "}\n" +
      "\n" +
      "function someMethod(a, b) {\n" +
      "}"
    );
  });

  xit('should convert Object.defineProperty to setters and getters', function () {
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
      "  constructor() {\n" +
      "  }\n" +
      "\n" +
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

  it('should not forget to copy over Class constructor arguments after transforming', function () {
    expect(test(
      "function someClass(a, b) {\n" +
      "}\n" +
      "someClass.prototype.someMethod = function(ma, mb) {\n" +
      "};"
    )).to.equal(
      "class someClass {\n" +
      "  constructor(a, b) {\n" +
      "  }\n" +
      "\n" +
      "  someMethod(ma, mb) {\n" +
      "  }\n" +
      "}"
    );
  });

});
