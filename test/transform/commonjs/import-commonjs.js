import createTestHelpers from '../../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['commonjs']);

describe('Import CommonJS', () => {
  describe('default import', () => {
    it('should convert basic var/let/const with require()', () => {
      expectTransform('var   foo = require("foo");').toReturn('import foo from "foo";');
      expectTransform('const foo = require("foo");').toReturn('import foo from "foo";');
      expectTransform('let   foo = require("foo");').toReturn('import foo from "foo";');
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
      expectTransform(
        'var foo = require("foo"), bar = require("bar");'
      ).toReturn(
        'import foo from "foo";\n' +
        'import bar from "bar";'
      );
    });

    it('should convert var/let/const with intermixed require() calls and normal initializations', () => {
      expectTransform(
        'var foo = require("foo"), bar = 15;'
      ).toReturn(
        'import foo from "foo";\n' +
        'var bar = 15;'
      );

      expectTransform(
        'let abc, foo = require("foo")'
      ).toReturn(
        'let abc;\n' +
        'import foo from "foo";'
      );

      expectTransform(
        'const greeting = "hello", foo = require("foo");'
      ).toReturn(
        'const greeting = "hello";\n' +
        'import foo from "foo";'
      );
    });

    // It would be nice to preserve the combined declarations,
    // but this kind of intermixed vars should really be a rare edge case.
    it('does not need to preserve combined variable declarations', () => {
      expectTransform(
        'var foo = require("foo"), bar = 1, baz = 2;'
      ).toReturn(
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
      ).withWarnings([
        {line: 2, msg: 'import can only be at root level', type: 'commonjs'}
      ]);
    });

    it('should treat require().default as default import', () => {
      expectTransform(
        'var foo = require("foolib").default;'
      ).toReturn(
        'import foo from "foolib";'
      );
    });

    it('should treat {default: foo} destructuring as default import', () => {
      expectTransform(
        'var {default: foo} = require("foolib");'
      ).toReturn(
        'import foo from "foolib";'
      );
    });

    it('should recognize default import inside several destructurings', () => {
      expectTransform(
        'var {default: foo, bar: bar} = require("foolib");'
      ).toReturn(
        'import foo, {bar} from "foolib";'
      );
    });
  });

  describe('named import', () => {
    it('should convert foo = require().foo to named import', () => {
      expectTransform(
        'var foo = require("foolib").foo;'
      ).toReturn(
        'import {foo} from "foolib";'
      );
    });

    it('should convert bar = require().foo to aliased named import', () => {
      expectTransform(
        'var bar = require("foolib").foo;'
      ).toReturn(
        'import {foo as bar} from "foolib";'
      );
    });

    it('should convert simple object destructuring to named import', () => {
      expectTransform(
        'var {foo} = require("foolib");'
      ).toReturn(
        'import {foo} from "foolib";'
      );
    });

    it('should convert aliased object destructuring to named import', () => {
      expectTransform(
        'var {foo: bar} = require("foolib");'
      ).toReturn(
        'import {foo as bar} from "foolib";'
      );
    });

    it('should convert multi-field object destructurings to named imports', () => {
      expectTransform(
        'var {foo, bar: myBar, baz} = require("foolib");'
      ).toReturn(
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

  describe('comments', () => {
    it('should preserve comments before var declaration', () => {
      expectTransform(
        '// Comments\n' +
        'var foo = require("foo");'
      ).toReturn(
        '// Comments\n' +
        'import foo from "foo";'
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
