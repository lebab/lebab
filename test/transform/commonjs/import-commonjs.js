import {expect} from 'chai';
import Transformer from './../../../lib/transformer';
const transformer = new Transformer({commonjs: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Import CommonJS', () => {
  describe('default import', () => {
    it('should convert basic var/let/const with require()', () => {
      expect(test('var   foo = require("foo");')).to.equal('import foo from "foo";');
      expect(test('const foo = require("foo");')).to.equal('import foo from "foo";');
      expect(test('let   foo = require("foo");')).to.equal('import foo from "foo";');
    });

    it('should do nothing with var that contains no require()', () => {
      expectNoChange('var foo = "bar";');
      expectNoChange('var foo;');
    });

    it('should do nothing with require() that does not have a single string argument', () => {
      expectNoChange('var foo = require();');
      expectNoChange('var foo = require("foo", {});');
      expectNoChange('var foo = require(bar);');
      expectNoChange('var foo = require(123);');
    });

    it('should convert var with multiple require() calls', () => {
      expect(test(
        'var foo = require("foo"), bar = require("bar");'
      )).to.equal(
        'import foo from "foo";\n' +
        'import bar from "bar";'
      );
    });

    it('should convert var/let/const with intermixed require() calls and normal initializations', () => {
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
    it('does not need to preserve combined variable declarations', () => {
      expect(test(
        'var foo = require("foo"), bar = 1, baz = 2;'
      )).to.equal(
        'import foo from "foo";\n' +
        'var bar = 1;\n' +
        'var baz = 2;'
      );
    });

    it('should ignore require calls inside statements', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var foo = require("foo");\n' +
        '}'
      );
    });
  });

  describe('named import', () => {
    it('should convert foo = require().foo to named import', () => {
      expect(test(
        'var foo = require("foolib").foo;'
      )).to.equal(
        'import {foo} from "foolib";'
      );
    });

    it('should convert bar = require().foo to aliased named import', () => {
      expect(test(
        'var bar = require("foolib").foo;'
      )).to.equal(
        'import {foo as bar} from "foolib";'
      );
    });

    it('should convert simple object destructuring to named import', () => {
      expect(test(
        'var {foo} = require("foolib");'
      )).to.equal(
        'import {foo} from "foolib";'
      );
    });

    it('should convert aliased object destructuring to named import', () => {
      expect(test(
        'var {foo: bar} = require("foolib");'
      )).to.equal(
        'import {foo as bar} from "foolib";'
      );
    });

    it('should convert multi-field object destructurings to named imports', () => {
      expect(test(
        'var {foo, bar: myBar, baz} = require("foolib");'
      )).to.equal(
        'import {foo, bar as myBar, baz} from "foolib";'
      );
    });

    it('should ignore array destructuring', () => {
      expectNoChange(
        'var [a, b, c] = require("foolib");'
      );
    });

    it('should ignore nested object destructuring', () => {
      expectNoChange(
        'var {foo: {bar}} = require("foolib");'
      );
    });

    it('should ignore destructuring of require().foo', () => {
      expectNoChange(
        'var {foo} = require("foolib").foo;'
      );
    });
  });

  // Not yet supported things...

  it('should not convert assignment of require() call', () => {
    expectNoChange('foo = require("foo");');
  });

  it('should not convert unassigned require() call', () => {
    expectNoChange('require("foo");');
  });
});
