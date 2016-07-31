import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({let: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Let/const', () => {
  describe('with uninitialized variable', () => {
    it('should use let when never used afterwards', () => {
      expect(test(
        'var x;'
      )).to.equal(
        'let x;'
      );
    });

    it('should use let when assigned aftwerwards', () => {
      expect(test(
        'var x;\n' +
        'x = 6;'
      )).to.equal(
        'let x;\n' +
        'x = 6;'
      );
    });
  });

  describe('with initialized variable', () => {
    it('should use const when never used afterwards', () => {
      expect(test(
        'var x = 2;'
      )).to.equal(
        'const x = 2;'
      );
    });

    it('should use const when only referenced afterwards', () => {
      expect(test(
        'var x = 2;\n' +
        'foo(x);'
      )).to.equal(
        'const x = 2;\n' +
        'foo(x);'
      );
    });

    it('should use let when re-assigned afterwards', () => {
      expect(test(
        'var x = 5;\n' +
        'x = 6;'
      )).to.equal(
        'let x = 5;\n' +
        'x = 6;'
      );
    });

    it('should use let when updated aftwerwards', () => {
      expect(test(
        'var x = 5;\n' +
        'x++;'
      )).to.equal(
        'let x = 5;\n' +
        'x++;'
      );
    });

    it('should handle variables names identical to Object prototype methods', () => {
      expect(test(
        'var constructor = 1;\n' +
        'var toString = 1;\n' +
        'var valueOf = 1;\n' +
        'var hasOwnProperty = 1;'
      )).to.equal(
        'const constructor = 1;\n' +
        'const toString = 1;\n' +
        'const valueOf = 1;\n' +
        'const hasOwnProperty = 1;'
      );
    });
  });

  describe('with multi-variable declaration', () => {
    it('should use const when not referenced afterwards', () => {
      expect(test(
        'var x = 1, y = 2;'
      )).to.equal(
        'const x = 1, y = 2;'
      );
    });

    it('should use let when assigned to afterwards', () => {
      expect(test(
        'var x = 1, y = 2;\n' +
        'x = 3;\n' +
        'y = 4;'
      )).to.equal(
        'let x = 1, y = 2;\n' +
        'x = 3;\n' +
        'y = 4;'
      );
    });

    it('should use let when initially unassigned but assigned afterwards', () => {
      expect(test(
        'var x, y;\n' +
        'x = 3;\n' +
        'y = 4;'
      )).to.equal(
        'let x, y;\n' +
        'x = 3;\n' +
        'y = 4;'
      );
    });

    it('should split to let & const when only some vars assigned to afterwards', () => {
      expect(test(
        'var x = 1, y = 2;\n' +
        'y = 4;'
      )).to.equal(
        'const x = 1;\n' +
        'let y = 2;\n' +
        'y = 4;'
      );
    });

    it('should split to let & var when only some vars are block-scoped', () => {
      expect(test(
        'if (true) {\n' +
        '  var x = 1, y = 2;\n' +
        '  x = 10;\n' +
        '}\n' +
        'y = 20;'
      )).to.equal(
        'if (true) {\n' +
        '  let x = 1;\n' +
        '  var y = 2;\n' +
        '  x = 10;\n' +
        '}\n' +
        'y = 20;'
      );
    });

    it('should split to let & const inside switch case', () => {
      expect(test(
        'switch (nr) {\n' +
        'case 15:\n' +
        '  var x = 1, y = 2;\n' +
        '  x++;\n' +
        '}'
      )).to.equal(
        'switch (nr) {\n' +
        'case 15:\n' +
        '  let x = 1;\n' +
        '  const y = 2;\n' +
        '  x++;\n' +
        '}'
      );
    });
  });

  describe('with multi-variable declaration in restrictive parent', () => {
    it('should use const when all consts in if-statement', () => {
      expect(test(
        'if (true) var x = 1, y = 2'
      )).to.equal(
        'if (true) const x = 1, y = 2;'
      );
    });

    it('should use let when both let & const in if-statement', () => {
      expect(test(
        'if (true) var x = 1, y = ++x;'
      )).to.equal(
        'if (true) let x = 1, y = ++x;'
      );
    });

    it('should use var when both var & const in if-statement', () => {
      expect(test(
        'if (false) {\n' +
        '  if (true) var x = 1, y = ++x;\n' +
        '}\n' +
        'foo(x);'
      )).to.equal(
        'if (false) {\n' +
        '  if (true) var x = 1, y = ++x;\n' +
        '}\n' +
        'foo(x);'
      );
    });

    it('should use let when both let & const in else-side of if-statement', () => {
      expect(test(
        'if (true); else var x = 1, y = ++x;'
      )).to.equal(
        'if (true); else let x = 1, y = ++x;'
      );
    });

    it('should use let when both let & const in for-loop head', () => {
      expect(test(
        'for (var i=0, len=arr.length; i<len; i++) {}'
      )).to.equal(
        'for (let i=0, len=arr.length; i<len; i++) {}'
      );
    });

    it('should use let when both let & const in for-in-loop body', () => {
      expect(test(
        'for (item in array) var x = 1, y = ++x'
      )).to.equal(
        'for (item in array) let x = 1, y = ++x'
      );
    });
  });

  describe('with destructured variable declaration', () => {
    it('should use const when not referenced afterwards', () => {
      expect(test(
        'var [x, y] = [1, 2];\n' +
        'var {foo, bar} = {foo: 1, bar: 2};'
      )).to.equal(
        'const [x, y] = [1, 2];\n' +
        'const {foo, bar} = {foo: 1, bar: 2};'
      );
    });

    it('should use let when assigned to afterwards', () => {
      expect(test(
        'var [x, y] = [1, 2];\n' +
        'x = 3;\n' +
        'y = 4;'
      )).to.equal(
        'let [x, y] = [1, 2];\n' +
        'x = 3;\n' +
        'y = 4;'
      );
    });

    it('should use let when only some vars assigned to afterwards', () => {
      expect(test(
        'var [x, y] = [1, 2];\n' +
        'y = 4;'
      )).to.equal(
        'let [x, y] = [1, 2];\n' +
        'y = 4;'
      );
    });

    it('should use var when only some vars are block-scoped', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var [x, y] = [1, 2];\n' +
        '  x = 10;\n' +
        '}\n' +
        'y = 20;'
      );
    });
  });

  describe('with nested function', () => {
    it('should use let when variable re-declared inside it', () => {
      expect(test(
        'var a = 0;\n' +
        'function foo() { var a = 1; }\n' +
        'a = 2;'
      )).to.equal(
        'let a = 0;\n' +
        'function foo() { const a = 1; }\n' +
        'a = 2;'
      );
    });

    it('should use let when variable assigned inside it', () => {
      expect(test(
        'var a = 0;\n' +
        'function foo() { a = 1; }'
      )).to.equal(
        'let a = 0;\n' +
        'function foo() { a = 1; }'
      );
    });

    it('should use const when variable referenced inside it', () => {
      expect(test(
        'var a = 0;\n' +
        'function foo() { bar(a); }'
      )).to.equal(
        'const a = 0;\n' +
        'function foo() { bar(a); }'
      );
    });

    it('should use const when variable redeclared as parameter', () => {
      expect(test(
        'var a = 0;\n' +
        'function foo(a) { a = 1; }'
      )).to.equal(
        'const a = 0;\n' +
        'function foo(a) { a = 1; }'
      );
    });

    it('should work with anonymous function declaration', () => {
      expect(test(
        'export default function () { var a = 1; }'
      )).to.equal(
        'export default function () { const a = 1; }'
      );
    });
  });

  describe('with nested arrow-function', () => {
    it('should use let when variable re-declared inside it', () => {
      expect(test(
        'var a = 0;\n' +
        '() => { var a = 1; };\n' +
        'a = 2;'
      )).to.equal(
        'let a = 0;\n' +
        '() => { const a = 1; };\n' +
        'a = 2;'
      );
    });

    it('should use let when variable assigned inside it', () => {
      expect(test(
        'var a = 0;\n' +
        '() => { a = 1; };'
      )).to.equal(
        'let a = 0;\n' +
        '() => { a = 1; };'
      );
    });

    it('should use const when variable referenced inside it', () => {
      expect(test(
        'var a = 0;\n' +
        '() => { bar(a); };'
      )).to.equal(
        'const a = 0;\n' +
        '() => { bar(a); };'
      );
    });

    it('should use const when variable redeclared as parameter', () => {
      expect(test(
        'var a = 0;\n' +
        '(a) => a = 1;'
      )).to.equal(
        'const a = 0;\n' +
        '(a) => a = 1;'
      );
    });
  });

  describe('with nested function that uses destructured parmaters', () => {
    it('should use const when variable redeclared as parameter', () => {
      expect(test(
        'var a = 0;\n' +
        'function foo({a}) { a = 1; };'
      )).to.equal(
        'const a = 0;\n' +
        'function foo({a}) { a = 1; };'
      );
    });
  });

  describe('with nested block', () => {
    it('should use let when variable assigned in it', () => {
      expect(test(
        'var a = 0;\n' +
        'if (true) { a = 1; }'
      )).to.equal(
        'let a = 0;\n' +
        'if (true) { a = 1; }'
      );
    });

    it('should use const when variable referenced in it', () => {
      expect(test(
        'var a = 0;\n' +
        'if (true) { foo(a); }'
      )).to.equal(
        'const a = 0;\n' +
        'if (true) { foo(a); }'
      );
    });

    it('should use let when variable only assigned inside a single block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  a = 2;\n' +
        '}'
      )).to.equal(
        'if (true) {\n' +
        '  let a = 1;\n' +
        '  a = 2;\n' +
        '}'
      );
    });

    it('should use const when variable only referenced inside a single block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  foo(a);\n' +
        '}'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '  foo(a);\n' +
        '}'
      );
    });

    it('should use let when variable assigned inside further nested block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  if (false) { a = 2; }\n' +
        '}'
      )).to.equal(
        'if (true) {\n' +
        '  let a = 1;\n' +
        '  if (false) { a = 2; }\n' +
        '}'
      );
    });

    it('should use const when variable referenced inside further nested block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  if (false) { foo(a); }\n' +
        '}'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '  if (false) { foo(a); }\n' +
        '}'
      );
    });

    it('should ignore variable declared inside a block but assigned outside', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'a += 1;'
      );
    });

    it('should ignore variable declared inside a block but referenced outside', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'foo(a);'
      );
    });

    it('should use const when variable name used in object property outside the block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'obj.a = 2;\n' +
        'x = {a: 2};'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'obj.a = 2;\n' +
        'x = {a: 2};'
      );
    });

    it('should use const when variable name used as function expression name outside the block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = function a() {}'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'fn = function a() {}'
      );
    });

    it('should use const when variable name used as function parameter name outside the block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'function fn(a) {}'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'function fn(a) {}'
      );
    });

    it('should use const when variable name used as arrow-function parameter name outside the block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = (a) => {};'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'fn = (a) => {};'
      );
    });

    it('should use const when variable name used as destructured function parameter name outside the block', () => {
      expect(test(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'function fn({a}) {}'
      )).to.equal(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'function fn({a}) {}'
      );
    });

    it('should ignore variable referenced in function body outside the block', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = function() { return a; }'
      );
    });

    it('should ignore variable referenced in shorthand arrow-function body outside the block', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = () => a;'
      );
    });

    it('should ignore variable referenced in variable declaration outside the block', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'const foo = a;'
      );
    });
  });

  describe('in loop heads', () => {
    it('should convert var in for-loop head to let', () => {
      expect(test(
        'for (var i=0; i<10; i++) { foo(i); }'
      )).to.equal(
        'for (let i=0; i<10; i++) { foo(i); }'
      );
    });

    it('should convert var in for-in head to const', () => {
      expect(test(
        'for (var key in obj) { foo(key); }'
      )).to.equal(
        'for (const key in obj) { foo(key); }'
      );
    });

    it('should convert var in for-of head to const', () => {
      expect(test(
        'for (var item of array) { foo(item); }'
      )).to.equal(
        'for (const item of array) { foo(item); }'
      );
    });

    it('should ignore var in for-loop head that is referenced outside the loop', () => {
      expectNoChange(
        'for (var i=0; i<10; i++) {}\n' +
        'foo(i);'
      );
    });

    it('should ignore var in for-in-loop head that is referenced outside the loop', () => {
      expectNoChange(
        'for (var key in obj) {}\n' +
        'foo(key);'
      );
    });

    it('should ignore var in for-of-loop head that is referenced outside the loop', () => {
      expectNoChange(
        'for (var item of array) {}\n' +
        'foo(item);'
      );
    });
  });

  // Variable hoisting
  describe('with variable assigned before declared', () => {
    it('should ignore', () => {
      expectNoChange(
        'a = 1;\n' +
        'var a = 2;'
      );
    });

    it('should ignore when similar variable in outer scope', () => {
      expect(test(
        'var a = 0;\n' +
        'function foo() {\n' +
        '  a = 1;\n' +
        '  var a = 2;\n' +
        '}'
      )).to.equal(
        'const a = 0;\n' +
        'function foo() {\n' +
        '  a = 1;\n' +
        '  var a = 2;\n' +
        '}'
      );
    });
  });

  describe('with variable referenced before declared', () => {
    it('should ignore', () => {
      expectNoChange(
        'foo(a);\n' +
        'var a = 2;'
      );
    });
  });

  describe('with repeated variable declarations', () => {
    it('should ignore', () => {
      expectNoChange(
        'var a = 1;\n' +
        'var a = 2;'
      );
    });

    it('should ignore when declarations in different blocks', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'if (true) {\n' +
        '  var a;\n' +
        '  foo(a);\n' +
        '}'
      );
    });

    it('should ignore when re-declaring of function parameter', () => {
      expectNoChange(
        'function foo(a) {\n' +
        '  var a = 1;\n' +
        '}'
      );
    });

    it('should ignore when re-declaring of destuctured function parameter', () => {
      expectNoChange(
        'function foo({a}) {\n' +
        '  var a = 1;\n' +
        '}'
      );
    });

    it('should ignore when re-declaring of function expression name', () => {
      expectNoChange(
        '(function foo(a) {\n' +
        '  var foo;\n' +
        '  return foo;\n' +
        '})();'
      );
    });

    it('should allow re-declaring of function declaration name', () => {
      expect(test(
        'function foo(a) {\n' +
        '  var foo;\n' +
        '  return foo;\n' +
        '}'
      )).to.equal(
        'function foo(a) {\n' +
        '  let foo;\n' +
        '  return foo;\n' +
        '}'
      );
    });
  });

  describe('with destructuring assignment', () => {
    it('should use let when array destructuring used', () => {
      expect(test(
        'var foo = 1;\n' +
        '[foo] = [1, 2, 3];'
      )).to.equal(
        'let foo = 1;\n' +
        '[foo] = [1, 2, 3];'
      );
    });

    it('should use let when object destructuring used', () => {
      expect(test(
        'var foo = 1;\n' +
        '({foo}) = {foo: 2};'
      )).to.equal(
        'let foo = 1;\n' +
        '({foo}) = {foo: 2};'
      );
    });

    it('should use let when nested destructuring used', () => {
      expect(test(
        'var foo = 1;\n' +
        '[{foo}] = [{foo: 2}];'
      )).to.equal(
        'let foo = 1;\n' +
        '[{foo}] = [{foo: 2}];'
      );
    });

    it('should use let for all variables modified through destructuring', () => {
      expect(test(
        'var a = 1;\n' +
        'var b = 1;\n' +
        'var c = 1;\n' +
        '[a, {foo: c}] = [3, {foo: 2}];'
      )).to.equal(
        'let a = 1;\n' +
        'const b = 1;\n' +
        'let c = 1;\n' +
        '[a, {foo: c}] = [3, {foo: 2}];'
      );
    });

    it('should use const when name is used as property key in object destructor', () => {
      expect(test(
        'var foo = 1;\n' +
        '({foo: a}) = {foo: 2};'
      )).to.equal(
        'const foo = 1;\n' +
        '({foo: a}) = {foo: 2};'
      );
    });
  });

  // Completely disallow conversion of existing let & const.
  // (While we could convert several cases of let to const,
  // we cannot right now guarantee correct conversion of all
  // the edge cases.)
  describe('existing let/const', () => {
    it('should not convert existing let to const', () => {
      expectNoChange(
        'let x = 1;'
      );
    });

    it('should not convert existing const to var', () => {
      expectNoChange(
        'if (true) {\n' +
        '  const x = 1;\n' +
        '} else {\n' +
        '  const x = 2;\n' +
        '}'
      );
    });

    it('should not convert existing let to var', () => {
      expectNoChange(
        'if (true) {\n' +
        '  let x = 1;\n' +
        '} else {\n' +
        '  let x = 2;\n' +
        '}'
      );
    });
  });

  // Possible errors (Issues #31 and #53)
  describe('regression tests', () => {
    it('should not throw error for assignment to undeclared variable', () => {
      expectNoChange('x = 2;');
    });

    it('should not throw error for assignment to object property', () => {
      expectNoChange('this.y = 5;');
    });

    it('should use const when similarly-named property is assigned to', () => {
      expect(test(
        'var x = 2;\n' +
        'b.x += 1;'
      )).to.equal(
        'const x = 2;\n' +
        'b.x += 1;'
      );
    });

    it('should use const when similarly-named property is updated', () => {
      expect(test(
        'var x = 2;\n' +
        'b.x++;'
      )).to.equal(
        'const x = 2;\n' +
        'b.x++;'
      );
    });
  });

  describe('comments', () => {
    it('should preserve comment line', () => {
      expect(test(
        '// comment line\n' +
        'var x = 42;'
      )).to.equal(
        '// comment line\n' +
        'const x = 42;'
      );
    });

    it('should preserve trailing comment', () => {
      expect(test(
        'var x = 42; // trailing comment'
      )).to.equal(
        'const x = 42; // trailing comment'
      );
    });

    it('should preserve comment before var broken up to let & const', () => {
      // For some reason Recast creates an additional line-break after const.
      // Unsure whether it's a bug in Recast or problem with how we preserve
      // comments.
      expect(test(
        '// comment line\n' +
        'var x = 1, y = 2;\n' +
        'y = 3;'
      )).to.equal(
        '// comment line\n' +
        'const x = 1;\n' +
        '\n' +
        'let y = 2;\n' +
        'y = 3;'
      );
    });

    it('should preserve comment between var broken up to let & const', () => {
      // This is another weird behavior of Recast.
      // The comment gets preserved, but placed in pretty strange spot.
      expect(test(
        '// comment line\n' +
        'var x = 1, // comment\n' +
        '    y = 2;\n' +
        'y = 3;'
      )).to.equal(
        '// comment line\n' +
        'const // comment\n' +
        'x = 1;\n' +
        '\n' +
        'let y = 2;\n' +
        'y = 3;'
      );
    });
  });
});
