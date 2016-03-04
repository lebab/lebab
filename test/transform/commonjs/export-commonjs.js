import {expect} from 'chai';
import Transformer from './../../../lib/transformer';
const transformer = new Transformer({commonjs: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

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

    it('should ignore exports.foo = function bar(){}', () => {
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

    it('should ignore exports.foo inside statements', () => {
      expectNoChange(
        'if (true) {\n' +
        '  exports.foo = function() {};\n' +
        '}'
      );
    });

    // Not yet supported features
    it('should ignore exports.foo = <some-other-value>', () => {
      expectNoChange(
        'exports.foo = 123;\n' +
        'exports.bar = {a: 1, b: 2};\n' +
        'exports.baz = "Hello";'
      );
    });
  });

});
