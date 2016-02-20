var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({
  classes: true,
  stringTemplates: true,
  arrowFunctions: true,
  let: true,
  defaultArguments: true,
  objectMethods: true,
  objectShorthands: true,
  noStrict: true,
  commonjs: true,
});

function test(script) {
  return transformer.run(script);
}

describe('Comments', function () {

  it("shouldn't convert comment line", function () {
    expect(test(
      '// comment line\n' +
      'var x = 42;'
    )).to.equal(
      '// comment line\n' +
      'const x = 42;'
    );
  });

  it("shouldn't convert trailing comment", function () {
    expect(test(
      'var x = 42; // trailing comment'
    )).to.equal(
      'const x = 42; // trailing comment'
    );
  });

  it("shouldn't eliminate leading newlines", function () {
    expect(test(
      '\n\nvar x = 42;'
    )).to.equal(
      '\n\nconst x = 42;'
    );
  });

  it("shouldn't eliminate trailing newlines", function () {
    expect(test(
      'var x = 42;\n\n'
    )).to.equal(
      'const x = 42;\n\n'
    );
  });

  it("ignores #! comment at the beginning of file", function () {
    expect(test(
      '#!/usr/bin/env node\n' +
      'var x = 42;'
    )).to.equal(
      '#!/usr/bin/env node\n' +
      'const x = 42;'
    );
  });

  it("ignores #! comment almost at the beginning of file", function () {
    expect(test(
      '\n' +
      '#!/usr/local/bin/node\n' +
      'if (true) {\n' +
      '  var foo = 42;\n' +
      '}'
    )).to.equal(
      '\n' +
      '#!/usr/local/bin/node\n' +
      'if (true) {\n' +
      '  const foo = 42;\n' +
      '}'
    );
  });

});
