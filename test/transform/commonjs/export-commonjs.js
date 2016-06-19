import createTestHelpers from '../../createTestHelpers';
const {expect, test, expectNoChange} = createTestHelpers({'commonjs': true});

describe('Export CommonJS', () => {
  describe('default export', () => {
    it('should convert module.exports assignment to default export', () => {
      expect(test('module.exports = 123;')).to.equal('export default 123;');
      expect(test('module.exports = function() {};')).to.equal('export default function() {};');
      expect(test('module.exports = x => x;')).to.equal('export default x => x;');
      expect(test('module.exports = class {};')).to.equal('export default class {};');
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
      );
    });
  });

  describe('named export', () => {
    it('should convert module.exports.foo = function(){}', () => {
      expect(test('module.exports.foo = function () {};')).to.equal('export function foo() {};');
    });

    it('should convert exports.foo = function(){}', () => {
      expect(test('exports.foo = function () {};')).to.equal('export function foo() {};');
    });

    it('should convert exports.foo = function foo(){}', () => {
      expect(test('exports.foo = function foo() {};')).to.equal('export function foo() {};');
    });

    it('should ignore function export when function name does not match with exported name', () => {
      expectNoChange('exports.foo = function bar() {};');
    });

    it('should convert exports.foo = arrow function', () => {
      expect(test(
        'exports.foo = () => {\n' +
        '  return 1;\n' +
        '};'
      )).to.equal(
        'export function foo() {\n' +
        '  return 1;\n' +
        '};'
      );
    });

    it('should convert exports.foo = arrow function short form', () => {
      expect(test(
        'exports.foo = x => x;'
      )).to.equal(
        'export function foo(x) {\n' +
        '  return x;\n' +
        '};'
      );
    });

    it('should convert exports.Foo = class {};', () => {
      expect(test('exports.Foo = class {};')).to.equal('export class Foo {};');
    });

    it('should convert exports.Foo = class Foo {};', () => {
      expect(test('exports.Foo = class Foo {};')).to.equal('export class Foo {};');
    });

    it('should ignore class export when class name does not match with exported name', () => {
      expectNoChange('exports.Foo = class Bar {};');
    });

    it('should convert exports.foo = foo;', () => {
      expect(test('exports.foo = foo;')).to.equal('export {foo};');
    });

    it('should convert exports.foo = bar;', () => {
      expect(test('exports.foo = bar;')).to.equal('export {bar as foo};');
    });

    it('should export undefined & NaN like any other identifier', () => {
      expect(test('exports.foo = undefined;')).to.equal('export {undefined as foo};');
      expect(test('exports.foo = NaN;')).to.equal('export {NaN as foo};');
    });

    it('should convert exports.foo = <literal> to export var', () => {
      expect(test('exports.foo = 123;')).to.equal('export var foo = 123;');
      expect(test('exports.foo = {a: 1, b: 2};')).to.equal('export var foo = {a: 1, b: 2};');
      expect(test('exports.foo = [1, 2, 3];')).to.equal('export var foo = [1, 2, 3];');
      expect(test('exports.foo = "Hello";')).to.equal('export var foo = "Hello";');
      expect(test('exports.foo = null;')).to.equal('export var foo = null;');
      expect(test('exports.foo = true;')).to.equal('export var foo = true;');
      expect(test('exports.foo = false;')).to.equal('export var foo = false;');
    });

    it('should ignore exports.foo inside statements', () => {
      expectNoChange(
        'if (true) {\n' +
        '  exports.foo = function() {};\n' +
        '}'
      );
    });
  });
});
