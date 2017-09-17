import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['let']);

describe('Let/const', () => {
  describe('with uninitialized variable', () => {
    it('should use let when never used afterwards', () => {
      expectTransform(
        'var x;'
      ).toReturn(
        'let x;'
      );
    });

    it('should use let when assigned aftwerwards', () => {
      expectTransform(
        'var x;\n' +
        'x = 6;'
      ).toReturn(
        'let x;\n' +
        'x = 6;'
      );
    });
  });

  describe('with initialized variable', () => {
    it('should use const when never used afterwards', () => {
      expectTransform(
        'var x = 2;'
      ).toReturn(
        'const x = 2;'
      );
    });

    it('should use const when only referenced afterwards', () => {
      expectTransform(
        'var x = 2;\n' +
        'foo(x);'
      ).toReturn(
        'const x = 2;\n' +
        'foo(x);'
      );
    });

    it('should use let when re-assigned afterwards', () => {
      expectTransform(
        'var x = 5;\n' +
        'x = 6;'
      ).toReturn(
        'let x = 5;\n' +
        'x = 6;'
      );
    });

    it('should use let when updated aftwerwards', () => {
      expectTransform(
        'var x = 5;\n' +
        'x++;'
      ).toReturn(
        'let x = 5;\n' +
        'x++;'
      );
    });

    it('should handle variables names identical to Object prototype methods', () => {
      expectTransform(
        'var constructor = 1;\n' +
        'var toString = 1;\n' +
        'var valueOf = 1;\n' +
        'var hasOwnProperty = 1;'
      ).toReturn(
        'const constructor = 1;\n' +
        'const toString = 1;\n' +
        'const valueOf = 1;\n' +
        'const hasOwnProperty = 1;'
      );
    });
  });

  describe('with multi-variable declaration', () => {
    it('should use const when not referenced afterwards', () => {
      expectTransform(
        'var x = 1, y = 2;'
      ).toReturn(
        'const x = 1, y = 2;'
      );
    });

    it('should use let when assigned to afterwards', () => {
      expectTransform(
        'var x = 1, y = 2;\n' +
        'x = 3;\n' +
        'y = 4;'
      ).toReturn(
        'let x = 1, y = 2;\n' +
        'x = 3;\n' +
        'y = 4;'
      );
    });

    it('should use let when initially unassigned but assigned afterwards', () => {
      expectTransform(
        'var x, y;\n' +
        'x = 3;\n' +
        'y = 4;'
      ).toReturn(
        'let x, y;\n' +
        'x = 3;\n' +
        'y = 4;'
      );
    });

    it('should split to let & const when only some vars assigned to afterwards', () => {
      expectTransform(
        'var x = 1, y = 2;\n' +
        'y = 4;'
      ).toReturn(
        'const x = 1;\n' +
        'let y = 2;\n' +
        'y = 4;'
      );
    });

    it('should split to let & var when only some vars are block-scoped', () => {
      expectTransform(
        'if (true) {\n' +
        '  var x = 1, y = 2;\n' +
        '  x = 10;\n' +
        '}\n' +
        'y = 20;'
      ).toReturn(
        'if (true) {\n' +
        '  let x = 1;\n' +
        '  var y = 2;\n' +
        '  x = 10;\n' +
        '}\n' +
        'y = 20;'
      );
    });

    it('should split to let & const inside switch case', () => {
      expectTransform(
        'switch (nr) {\n' +
        'case 15:\n' +
        '  var x = 1, y = 2;\n' +
        '  x++;\n' +
        '}'
      ).toReturn(
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
      expectTransform(
        'if (true) var x = 1, y = 2'
      ).toReturn(
        'if (true) const x = 1, y = 2;'
      );
    });

    it('should use let when both let & const in if-statement', () => {
      expectTransform(
        'if (true) var x = 1, y = ++x;'
      ).toReturn(
        'if (true) let x = 1, y = ++x;'
      );
    });

    it('should use var when both var & const in if-statement', () => {
      expectTransform(
        'if (false) {\n' +
        '  if (true) var x = 1, y = ++x;\n' +
        '}\n' +
        'foo(x);'
      ).toReturn(
        'if (false) {\n' +
        '  if (true) var x = 1, y = ++x;\n' +
        '}\n' +
        'foo(x);'
      );
    });

    it('should use let when both let & const in else-side of if-statement', () => {
      expectTransform(
        'if (true); else var x = 1, y = ++x;'
      ).toReturn(
        'if (true); else let x = 1, y = ++x;'
      );
    });

    it('should use let when both let & const in for-loop head', () => {
      expectTransform(
        'for (var i=0, len=arr.length; i<len; i++) {}'
      ).toReturn(
        'for (let i=0, len=arr.length; i<len; i++) {}'
      );
    });

    it('should use let when both let & const in for-in-loop body', () => {
      expectTransform(
        'for (item in array) var x = 1, y = ++x'
      ).toReturn(
        'for (item in array) let x = 1, y = ++x'
      );
    });
  });

  describe('with destructured variable declaration', () => {
    it('should use const when not referenced afterwards', () => {
      expectTransform(
        'var [x, y] = [1, 2];\n' +
        'var {foo, bar} = {foo: 1, bar: 2};'
      ).toReturn(
        'const [x, y] = [1, 2];\n' +
        'const {foo, bar} = {foo: 1, bar: 2};'
      );
    });

    it('should use let when assigned to afterwards', () => {
      expectTransform(
        'var [x, y] = [1, 2];\n' +
        'x = 3;\n' +
        'y = 4;'
      ).toReturn(
        'let [x, y] = [1, 2];\n' +
        'x = 3;\n' +
        'y = 4;'
      );
    });

    it('should use let when only some vars assigned to afterwards', () => {
      expectTransform(
        'var [x, y] = [1, 2];\n' +
        'y = 4;'
      ).toReturn(
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
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
    });

    // Issue #236
    it('should not choke for ignored array values', () => {
      expectTransform(
        'var [, x, y] = [1, 2, 3];\n' +
        'y = 2;\n' +
        'console.log(x);'
      ).toReturn(
        'let [, x, y] = [1, 2, 3];\n' +
        'y = 2;\n' +
        'console.log(x);'
      );
    });
  });

  describe('with nested function', () => {
    it('should use let when variable re-declared inside it', () => {
      expectTransform(
        'var a = 0;\n' +
        'function foo() { var a = 1; }\n' +
        'a = 2;'
      ).toReturn(
        'let a = 0;\n' +
        'function foo() { const a = 1; }\n' +
        'a = 2;'
      );
    });

    it('should use let when variable assigned inside it', () => {
      expectTransform(
        'var a = 0;\n' +
        'function foo() { a = 1; }'
      ).toReturn(
        'let a = 0;\n' +
        'function foo() { a = 1; }'
      );
    });

    it('should use const when variable referenced inside it', () => {
      expectTransform(
        'var a = 0;\n' +
        'function foo() { bar(a); }'
      ).toReturn(
        'const a = 0;\n' +
        'function foo() { bar(a); }'
      );
    });

    it('should use const when variable redeclared as parameter', () => {
      expectTransform(
        'var a = 0;\n' +
        'function foo(a) { a = 1; }'
      ).toReturn(
        'const a = 0;\n' +
        'function foo(a) { a = 1; }'
      );
    });

    it('should work with anonymous function declaration', () => {
      expectTransform(
        'export default function () { var a = 1; }'
      ).toReturn(
        'export default function () { const a = 1; }'
      );
    });
  });

  describe('with nested arrow-function', () => {
    it('should use let when variable re-declared inside it', () => {
      expectTransform(
        'var a = 0;\n' +
        '() => { var a = 1; };\n' +
        'a = 2;'
      ).toReturn(
        'let a = 0;\n' +
        '() => { const a = 1; };\n' +
        'a = 2;'
      );
    });

    it('should use let when variable assigned inside it', () => {
      expectTransform(
        'var a = 0;\n' +
        '() => { a = 1; };'
      ).toReturn(
        'let a = 0;\n' +
        '() => { a = 1; };'
      );
    });

    it('should use const when variable referenced inside it', () => {
      expectTransform(
        'var a = 0;\n' +
        '() => { bar(a); };'
      ).toReturn(
        'const a = 0;\n' +
        '() => { bar(a); };'
      );
    });

    it('should use const when variable redeclared as parameter', () => {
      expectTransform(
        'var a = 0;\n' +
        '(a) => a = 1;'
      ).toReturn(
        'const a = 0;\n' +
        '(a) => a = 1;'
      );
    });
  });

  describe('with nested function that uses destructured parameters', () => {
    it('should use const when variable redeclared as parameter', () => {
      expectTransform(
        'var a = 0;\n' +
        'function foo({a}) { a = 1; };'
      ).toReturn(
        'const a = 0;\n' +
        'function foo({a}) { a = 1; };'
      );
    });
  });

  describe('with nested block', () => {
    it('should use let when variable assigned in it', () => {
      expectTransform(
        'var a = 0;\n' +
        'if (true) { a = 1; }'
      ).toReturn(
        'let a = 0;\n' +
        'if (true) { a = 1; }'
      );
    });

    it('should use const when variable referenced in it', () => {
      expectTransform(
        'var a = 0;\n' +
        'if (true) { foo(a); }'
      ).toReturn(
        'const a = 0;\n' +
        'if (true) { foo(a); }'
      );
    });

    it('should use let when variable only assigned inside a single block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  a = 2;\n' +
        '}'
      ).toReturn(
        'if (true) {\n' +
        '  let a = 1;\n' +
        '  a = 2;\n' +
        '}'
      );
    });

    it('should use const when variable only referenced inside a single block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  foo(a);\n' +
        '}'
      ).toReturn(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '  foo(a);\n' +
        '}'
      );
    });

    it('should use let when variable assigned inside further nested block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  if (false) { a = 2; }\n' +
        '}'
      ).toReturn(
        'if (true) {\n' +
        '  let a = 1;\n' +
        '  if (false) { a = 2; }\n' +
        '}'
      );
    });

    it('should use const when variable referenced inside further nested block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '  if (false) { foo(a); }\n' +
        '}'
      ).toReturn(
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

    it('should ignore variable declared inside a block but referenced through computed property outside', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var x = 0;\n' +
        '}\n' +
        'foo[x]++;'
      );
    });

    it('should use const when variable name used in object property outside the block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'obj.a = 2;\n' +
        'x = {a: 2};'
      ).toReturn(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'obj.a = 2;\n' +
        'x = {a: 2};'
      );
    });

    it('should use const when variable name used as function expression name outside the block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = function a() {}'
      ).toReturn(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'fn = function a() {}'
      );
    });

    it('should use const when variable name used as function parameter name outside the block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'function fn(a) {}'
      ).toReturn(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'function fn(a) {}'
      );
    });

    it('should use const when variable name used as arrow-function parameter name outside the block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = (a) => {};'
      ).toReturn(
        'if (true) {\n' +
        '  const a = 1;\n' +
        '}\n' +
        'fn = (a) => {};'
      );
    });

    it('should use const when variable name used as destructured function parameter name outside the block', () => {
      expectTransform(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'function fn({a}) {}'
      ).toReturn(
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
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
    });

    it('should ignore variable referenced in shorthand arrow-function body outside the block', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'fn = () => a;'
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
    });

    it('should ignore variable referenced in variable declaration outside the block', () => {
      expectNoChange(
        'if (true) {\n' +
        '  var a = 1;\n' +
        '}\n' +
        'const foo = a;'
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
    });
  });

  describe('in loop heads', () => {
    it('should convert var in for-loop head to let', () => {
      expectTransform(
        'for (var i=0; i<10; i++) { foo(i); }'
      ).toReturn(
        'for (let i=0; i<10; i++) { foo(i); }'
      );
    });

    it('should convert var in for-in head to const', () => {
      expectTransform(
        'for (var key in obj) { foo(key); }'
      ).toReturn(
        'for (const key in obj) { foo(key); }'
      );
    });

    it('should convert var in for-of head to const', () => {
      expectTransform(
        'for (var item of array) { foo(item); }'
      ).toReturn(
        'for (const item of array) { foo(item); }'
      );
    });

    it('should ignore var in for-loop head that is referenced outside the loop', () => {
      expectNoChange(
        'for (var i=0; i<10; i++) {}\n' +
        'foo(i);'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform var', type: 'let'}
      ]);
    });

    it('should ignore var in for-in-loop head that is referenced outside the loop', () => {
      expectNoChange(
        'for (var key in obj) {}\n' +
        'foo(key);'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform var', type: 'let'}
      ]);
    });

    it('should ignore var in for-of-loop head that is referenced outside the loop', () => {
      expectNoChange(
        'for (var item of array) {}\n' +
        'foo(item);'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform var', type: 'let'}
      ]);
    });
  });

  // Variable hoisting
  describe('with variable assigned before declared', () => {
    it('should ignore', () => {
      expectNoChange(
        'a = 1;\n' +
        'var a = 2;'
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
    });

    it('should ignore when similar variable in outer scope', () => {
      expectTransform(
        'var a = 0;\n' +
        'function foo() {\n' +
        '  a = 1;\n' +
        '  var a = 2;\n' +
        '}'
      ).toReturn(
        'const a = 0;\n' +
        'function foo() {\n' +
        '  a = 1;\n' +
        '  var a = 2;\n' +
        '}'
      ).withWarnings([
        {line: 4, msg: 'Unable to transform var', type: 'let'}
      ]);
    });
  });

  describe('with variable referenced before declared', () => {
    it('should ignore', () => {
      expectNoChange(
        'foo(a);\n' +
        'var a = 2;'
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
    });
  });

  describe('with repeated variable declarations', () => {
    it('should ignore', () => {
      expectNoChange(
        'var a = 1;\n' +
        'var a = 2;'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform var', type: 'let'}
      ]);
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
      ).withWarnings([
        {line: 2, msg: 'Unable to transform var', type: 'let'}
      ]);
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
      expectTransform(
        'function foo(a) {\n' +
        '  var foo;\n' +
        '  return foo;\n' +
        '}'
      ).toReturn(
        'function foo(a) {\n' +
        '  let foo;\n' +
        '  return foo;\n' +
        '}'
      );
    });
  });

  describe('with destructuring assignment', () => {
    it('should use let when array destructuring used', () => {
      expectTransform(
        'var foo = 1;\n' +
        '[foo] = [1, 2, 3];'
      ).toReturn(
        'let foo = 1;\n' +
        '[foo] = [1, 2, 3];'
      );
    });

    it('should use let when object destructuring used', () => {
      expectTransform(
        'var foo = 1;\n' +
        '({foo} = {foo: 2});'
      ).toReturn(
        'let foo = 1;\n' +
        '({foo} = {foo: 2});'
      );
    });

    it('should use let when nested destructuring used', () => {
      expectTransform(
        'var foo = 1;\n' +
        '[{foo}] = [{foo: 2}];'
      ).toReturn(
        'let foo = 1;\n' +
        '[{foo}] = [{foo: 2}];'
      );
    });

    it('should use let for all variables modified through destructuring', () => {
      expectTransform(
        'var a = 1;\n' +
        'var b = 1;\n' +
        'var c = 1;\n' +
        '[a, {foo: c}] = [3, {foo: 2}];'
      ).toReturn(
        'let a = 1;\n' +
        'const b = 1;\n' +
        'let c = 1;\n' +
        '[a, {foo: c}] = [3, {foo: 2}];'
      );
    });

    it('should use const when name is used as property key in object destructor', () => {
      expectTransform(
        'var foo = 1;\n' +
        '({foo: a} = {foo: 2});'
      ).toReturn(
        'const foo = 1;\n' +
        '({foo: a} = {foo: 2});'
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
      expectTransform(
        'var x = 2;\n' +
        'b.x += 1;'
      ).toReturn(
        'const x = 2;\n' +
        'b.x += 1;'
      );
    });

    it('should use const when similarly-named property is updated', () => {
      expectTransform(
        'var x = 2;\n' +
        'b.x++;'
      ).toReturn(
        'const x = 2;\n' +
        'b.x++;'
      );
    });
  });

  describe('comments', () => {
    it('should preserve comment line', () => {
      expectTransform(
        '// comment line\n' +
        'var x = 42;'
      ).toReturn(
        '// comment line\n' +
        'const x = 42;'
      );
    });

    it('should preserve trailing comment', () => {
      expectTransform(
        'var x = 42; // trailing comment'
      ).toReturn(
        'const x = 42; // trailing comment'
      );
    });

    it('should preserve comment before var broken up to let & const', () => {
      // For some reason Recast creates an additional line-break after const.
      // Unsure whether it's a bug in Recast or problem with how we preserve
      // comments.
      expectTransform(
        '// comment line\n' +
        'var x = 1, y = 2;\n' +
        'y = 3;'
      ).toReturn(
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
      expectTransform(
        '// comment line\n' +
        'var x = 1, // comment\n' +
        '    y = 2;\n' +
        'y = 3;'
      ).toReturn(
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
