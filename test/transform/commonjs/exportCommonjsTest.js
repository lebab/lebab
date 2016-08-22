import createTestHelpers from '../../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['commonjs']);

describe('Export CommonJS', () => {
  describe('default export', () => {
    it('should convert module.exports assignment to default export', () => {
      expectTransform('module.exports = 123;').toReturn('export default 123;');
      expectTransform('module.exports = function() {};').toReturn('export default function() {};');
      expectTransform('module.exports = x => x;').toReturn('export default x => x;');
      expectTransform('module.exports = class {};').toReturn('export default class {};');
    });

    it('should not convert assignment to exports', () => {
      expectNoChange('exports = function() {};');
    });

    it('should not convert weird assignment to module.exports', () => {
      expectNoChange('module.exports += function() {};');
      expectNoChange('module.exports -= function() {};');
      expectNoChange('module.exports *= function() {};');
      expectNoChange('module.exports /= function() {};');
    });

    // A pretty weird thing to do...
    // shouldn't bother supporting it.
    it('should not convert assignment to module["exports"]', () => {
      expectNoChange('module["exports"] = function() {};');
    });

    it('should ignore module.exports inside statements', () => {
      expectNoChange(
        'if (true) {\n' +
        '  module.exports = function() {};\n' +
        '}'
      ).withWarnings([
        {line: 2, msg: 'export can only be at root level', type: 'commonjs'}
      ]);
    });
  });

  describe('named export', () => {
    it('should convert module.exports.foo = function () {}', () => {
      expectTransform('module.exports.foo = function () {};').toReturn('export function foo() {}');
    });

    it('should convert exports.foo = function () {}', () => {
      expectTransform('exports.foo = function () {};').toReturn('export function foo() {}');
    });

    it('should convert exports.foo = function foo() {}', () => {
      expectTransform('exports.foo = function foo() {};').toReturn('export function foo() {}');
    });

    it('should ignore function export when function name does not match with exported name', () => {
      expectNoChange('exports.foo = function bar() {};');
    });

    it('should convert exports.foo = arrow function', () => {
      expectTransform(
        'exports.foo = () => {\n' +
        '  return 1;\n' +
        '};'
      ).toReturn(
        'export function foo() {\n' +
        '  return 1;\n' +
        '}'
      );
    });

    it('should convert exports.foo = arrow function short form', () => {
      expectTransform(
        'exports.foo = x => x;'
      ).toReturn(
        'export function foo(x) {\n' +
        '  return x;\n' +
        '}'
      );
    });

    it('should convert exports.Foo = class {};', () => {
      expectTransform('exports.Foo = class {};').toReturn('export class Foo {}');
    });

    it('should convert exports.Foo = class Foo {};', () => {
      expectTransform('exports.Foo = class Foo {};').toReturn('export class Foo {}');
    });

    it('should ignore class export when class name does not match with exported name', () => {
      expectNoChange('exports.Foo = class Bar {};');
    });

    it('should convert exports.foo = foo;', () => {
      expectTransform('exports.foo = foo;').toReturn('export {foo};');
    });

    it('should convert exports.foo = bar;', () => {
      expectTransform('exports.foo = bar;').toReturn('export {bar as foo};');
    });

    it('should export undefined & NaN like any other identifier', () => {
      expectTransform('exports.foo = undefined;').toReturn('export {undefined as foo};');
      expectTransform('exports.foo = NaN;').toReturn('export {NaN as foo};');
    });

    it('should convert exports.foo = <literal> to export var', () => {
      expectTransform('exports.foo = 123;').toReturn('export var foo = 123;');
      expectTransform('exports.foo = {a: 1, b: 2};').toReturn('export var foo = {a: 1, b: 2};');
      expectTransform('exports.foo = [1, 2, 3];').toReturn('export var foo = [1, 2, 3];');
      expectTransform('exports.foo = "Hello";').toReturn('export var foo = "Hello";');
      expectTransform('exports.foo = null;').toReturn('export var foo = null;');
      expectTransform('exports.foo = true;').toReturn('export var foo = true;');
      expectTransform('exports.foo = false;').toReturn('export var foo = false;');
    });

    it('should ignore exports.foo inside statements', () => {
      expectNoChange(
        'if (true) {\n' +
        '  exports.foo = function() {};\n' +
        '}'
      );
    });
  });

  describe('comments', () => {
    it('should preserve comments before default export', () => {
      expectTransform(
        '// Comments\n' +
        'module.exports = function() {};'
      ).toReturn(
        '// Comments\n' +
        'export default function() {};'
      );
    });

    it('should preserve comments before named function export', () => {
      expectTransform(
        '// Comments\n' +
        'exports.foo = function() {};'
      ).toReturn(
        '// Comments\n' +
        'export function foo() {}'
      );
    });

    it('should preserve comments before named class export', () => {
      expectTransform(
        '// Comments\n' +
        'exports.Foo = class {};'
      ).toReturn(
        '// Comments\n' +
        'export class Foo {}'
      );
    });

    it('should preserve comments before identifier export', () => {
      expectTransform(
        '// Comments\n' +
        'exports.foo = foo;'
      ).toReturn(
        '// Comments\n' +
        'export {foo};'
      );
    });

    it('should preserve comments before named literal value export', () => {
      expectTransform(
        '// Comments\n' +
        'exports.FOO = 123;'
      ).toReturn(
        '// Comments\n' +
        'export var FOO = 123;'
      );
    });
  });
});
