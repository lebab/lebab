var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var importCommonJsTransformation = require('./../../lib/transformation/import-commonjs');

var transformer = new Transformer({});

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(importCommonJsTransformation);
  return transformer.out();
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Import CommonJS', function () {

  it('should convert basic var/let/const with require()', function () {
    expect(test('var   foo = require("foo");')).to.equal('import foo from "foo";');
    expect(test('const foo = require("foo");')).to.equal('import foo from "foo";');
    expect(test('let   foo = require("foo");')).to.equal('import foo from "foo";');
  });

  it('should do nothing with var that contains no require()', function () {
    expectNoChange('var foo = "bar";');
    expectNoChange('var foo;');
  });

  it('should do nothing with require() that does not have a single string argument', function () {
    expectNoChange('var foo = require();');
    expectNoChange('var foo = require("foo", {});');
    expectNoChange('var foo = require(bar);');
    expectNoChange('var foo = require(123);');
  });

  it('should convert var with multiple require() calls', function () {
    expect(test(
      'var foo = require("foo"), bar = require("bar");'
    )).to.equal(
      'import foo from "foo";\n' +
      'import bar from "bar";'
    );
  });

  it('should convert var/let/const with intermixed require() calls and normal initializations', function () {
    expect(test(
      'var foo = require("foo"), bar = 15;'
    )).to.equal(
      'import foo from "foo";\n' +
      'var bar = 15;'
    );

    expect(test(
      'let abc, foo = require("foo")'
    )).to.equal(
      'let abc;\n' +
      'import foo from "foo";'
    );

    expect(test(
      'const greeting = "hello", foo = require("foo");'
    )).to.equal(
      'const greeting = "hello";\n' +
      'import foo from "foo";'
    );
  });

  // It would be nice to preserve the combined declarations,
  // but this kind of intermixed vars should really be a rare edge case.
  it('does not need to preserve combined variable declarations', function () {
    expect(test(
      'var foo = require("foo"), bar = 1, baz = 2;'
    )).to.equal(
      'import foo from "foo";\n' +
      'var bar = 1;\n' +
      'var baz = 2;'
    );
  });

  // Not yet supported things...

  it('should not convert assignment of require() call', function () {
    expectNoChange('foo = require("foo");');
  });

  it('should not convert unassigned require() call', function () {
    expectNoChange('require("foo");');
  });

  it('should not convert require() with property extraction', function () {
    expectNoChange('var foo = require("foolib").foo;');
  });

  it('should not convert require() with object destruction', function () {
    expectNoChange('var {foo} = require("foolib");');
  });

});
