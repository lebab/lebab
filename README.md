[![Build Status](https://img.shields.io/travis/lebab/lebab.svg)](https://travis-ci.org/lebab/lebab)
[![Coverage Status](https://img.shields.io/codecov/c/github/lebab/lebab/master.svg)](https://codecov.io/github/lebab/lebab)
[![Dependencies](https://img.shields.io/librariesio/github/lebab/lebab.svg)](https://libraries.io/npm/lebab)
[![License](https://img.shields.io/:license-mit-brightgreen.svg)](https://mohebifar.mit-license.org)
[![Version](https://img.shields.io/npm/v/lebab.svg)](https://www.npmjs.com/package/lebab)

# Lebab

![Lebab](https://raw.githubusercontent.com/mohebifar/lebab-logo/master/logo.png)

**Lebab** transpiles your ES5 code to ES6/ES7.
It does exactly the opposite of what [Babel](https://babeljs.io/) does.
If you want to understand what Lebab exactly does, **[try the live demo](https://uniibu.github.io/lebab-ce/).**


## Install

Install it using npm:

```bash
$ npm install -g lebab
```

Full build:

- [latest Browserified version of Lebab](https://wzrd.in/standalone/lebab@latest)
- [the same, using cdn.rawgit](https://umdfied.herokuapp.com/umdfied/lebab/latest)

## Usage

Convert your old-fashioned code using the `lebab` cli tool,
enabling a specific transformation:

```bash
$ lebab es5.js -o es6.js --transform let
```

Or transform an entire directory of files in-place:

```bash
# .js files only
$ lebab --replace src/js/ --transform arrow
# For other file extensions, use explicit globbing
$ lebab --replace 'src/js/**/*.jsx' --transform arrow
```

For all the possible values for `--transform` option
see the detailed docs below or use `--help` from command line.


## Features and known limitations

The recommended way of using Lebab is to apply one transform at a time,
read what exactly the transform does and what are its limitations,
apply it for your code and inspect the diff carefully.

### Safe transforms

These transforms can be applied with relatively high confidence.
They use pretty straight-forward and strict rules for changing the code.
The resulting code should be almost 100% equivalent of the original code.

- [x] **arrow** - callbacks to arrow functions
    - [x] Converts bound functions like `function(){}.bind(this)`
    - [x] not applied to unbound functions that use `this`
    - [x] not applied to functions that use `arguments`
    - [x] not applied to object properties (use `obj-method` transform)
    - [ ] does not remove `that = this` assignments
- [x] **arrow-return** - drop return statements in arrow functions
    - [x] converts immediate return `{ return x; }` to `=> x`
    - [x] applies to arrow functions and nested arrow functions
    - [ ] LIMITATION only applies to arrow functions (run the `arrow` transform first)
- [x] **for-of** - for loop to for-of loop
    - [x] uses name `item` for loop variable when loop body begins with `var item = array[i];`
    - [ ] [does not work when no such alias defined at the start of loop body][166]
    - [ ] LIMITATION requires let/const variables (run the `let` transform first)
- [x] **for-each** - for loop to `Array.forEach()`
    - [x] uses name `item` for forEach parameter when loop body begins with `var item = array[i];`
    - [ ] [does not work when no such alias defined at the start of loop body][166]
    - [x] adds index parameter when loop body makes use of the index variable.
    - [ ] LIMITATION requires let/const variables (run the `let` transform first)
- [x] **arg-rest** - use of arguments to function(...args)
    - [x] does not perform the transform when `args` variable already exists
    - [ ] always names the rest-parameter to `args`
    - [ ] LIMITATION [does not transform functions with formal parameters][191]
    - [ ] LIMITATION [does not remove uses of `Array.slice.call(arguments)`][191]
- [x] **arg-spread** - use of apply() to spread operator
    - [x] recognizes `obj.method.apply(obj, args)`
    - [x] recognizes `func.apply(undefined, args)`
- [x] **obj-method** - function values in object to methods
    - [ ] LIMITATION [does not convert named function expressions][127]
    - [ ] does not convert arrow-functions
- [x] **obj-shorthand** - `{foo: foo}` to `{foo}`
    - [x] ignores numeric and `NaN` properties
    - [ ] does not convert string properties
- [x] **no-strict** - removal of `"use strict"` directives
    - [x] does not touch stuff like `x = "use strict";`
- [x] **exponent** - `Math.pow()` to `**` operator (**ES7**)
    - [x] Full support for all new syntax from ES7
- [x] **multi-var** - single `var x,y;` declaration to multiple `var x; var y;` (**refactor**)
    - [x] Not related to any new syntax feature
    - [x] EXPERIMENT [to see if Lebab could be a more generic refactoring helper][158]

### Unsafe transforms

These transforms should be applied with caution.
They either use heuristics which can't guarantee that the resulting code is equivalent of the original code,
or they have significant bugs which can result in breaking your code.

- [x] **let** - `var` to `let`/`const`
    - [x] never modified variables are converted to `const`
    - [x] properly recognizes block-scoping
    - [x] splits single var declaration to multiple `let`/`const` declarations if needed
    - [x] recognizes vars defined/assigned using destructuring
    - [x] vars that conflict with block-scoping are not converted
    - [x] repeated declarations of the same var are not converted
    - [x] existing `let`/`const` are not converted
    - [ ] BUG [fails with repeated variable definitions that use destructuring][131]
    - [ ] BUG [fails with closure over a loop variable][145]
    - [ ] BUG [fails when function closes over variable declared after function is called][168]
- [x] **class** - function/prototypes to classes
    - [x] recognizes `Foo.prototype.method = function(){ ... };`
    - [x] recognizes `Foo.prototype = { ...methods... };`
    - [x] recognizes static methods like `Foo.method = function(){ ... };`
    - [x] recognizes getters/setters defined with `Object.defineProperty()`
    - [x] recognizes inheritance with `Child.prototype = new Parent()`
    - [x] recognizes inheritance with `util.inherits(Child, Parent);`
    - [x] converts superclass constructor calls to `super()`
    - [x] converts superclass method calls to `super.method()`
    - [ ] LIMITATION [does not require super() call in subclass constructor][186]
    - [ ] LIMITATION [does not enforce super() call position in subclass constructor][186]
    - [ ] LIMITATION [does not support namespaced classes][113]
- [x] **commonjs** - CommonJS module definition to ES6 modules
    - [x] converts `var foo = require("foo")` to `import foo from "foo"`
    - [x] converts `var bar = require("foo").bar` to `import {bar} from "foo"`
    - [x] converts `var {bar} = require("foo")` to `import {bar} from "foo"`
    - [x] converts `module.exports = <anything>` to `export default <anything>`
    - [x] converts `exports.foo = function(){}` to `export function foo(){}`
    - [x] converts `exports.Foo = class {}` to `export class Foo {}`
    - [x] converts `exports.foo = 123` to `export var foo = 123`
    - [x] converts `exports.foo = bar` to `export {bar as foo}`
    - [ ] LIMITATION does not check if named export conflicts with existing variable names
    - [ ] LIMITATION Ignores imports/exports inside nested blocks/functions
    - [ ] LIMITATION only handles `require()` calls in `var` declarations
    - [ ] LIMITATION does not ensure that imported variable is treated as `const`
    - [ ] LIMITATION [does not ensure named exports are imported with correct ES6 syntax][215]
- [x] **template** - string concatenation to template strings
    - [x] converts variables and arbitrary expressions to `${...}`
    - [ ] BUG [removes indentation of multi-line strings][88]
    - [ ] LIMITATION [ignores difference between `.toString()` and `.valueOf()`][107]
- [x] **default-param** - default parameters instead of `a = a || 2`
    - [x] recognizes `a = a || 2`
    - [x] recognizes `a = a ? a : 2`
    - [x] recognizes `a = a === undefined ? 2 : a`
    - [x] recognizes `a = typeof a === 'undefined' ? 2 : a`
    - [ ] LIMITATION [transforming `a = a || 2` does not produce strictly equivalent code][125]
- [x] **destruct-param** - use destructuring for objects in function parameters
    - [x] converts `(obj) => obj.a + obj.b` to `({a, b}) => a + b`
    - [x] does not transform when conflicts with existing variables
    - [x] does not transform when object properties are modified
    - [ ] LIMITATION Only objects with maximum of 4 properties are transformed
    - [ ] BUG [Can conflict with variables introduced by the transform itself][200]
- [x] **includes** - `array.indexOf(foo) !== -1` to `array.includes(foo)` (**ES7**)
    - [x] works for both strings and arrays
    - [x] converts `!== -1` to `array.includes(foo)`
    - [x] converts `=== -1` to `!array.includes(foo)`
    - [x] recognizes all kinds of comparisons `>= 0`, `> -1`, etc
    - [x] recognizes both `indexOf() != -1` and `-1 != indexOf()`
    - [ ] LIMITATION does not detect that indexOf() is called on an actual Array or String.


## Programming API

Simply import and call the `transform()` function:

```js
import {transform} from 'lebab';
const {code, warnings} = transform(
  'var f = function(a) { return a; };', // code to transform
  ['let', 'arrow', 'arrow-return'] // transforms to apply
);
console.log(code); // -> "const f = a => a;"
```

The warnings will be an array of objects like:

```js
[
  {line: 12, msg: 'Unable to transform var', type: 'let'},
  {line: 45, msg: 'Can not use arguments in arrow function', type: 'arrow'},
]
```

Most of the time there won't be any warnings and the array will be empty.


## Editor plugins

Alternatively one can use Lebab through plugins in the following editors:

- Atom: [atom-lebab](https://github.com/ga2mer/atom-lebab)
- Sublime: [lebab-sublime](https://github.com/inkless/lebab-sublime) or [Lebab ES6 Transform](https://packagecontrol.io/packages/Lebab%20ES6%20Transform)
- VSCode: [vscode-lebab](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-lebab)


## What's next?

Which feature should Lebab implement next?
Let us know by [creating an issue](https://github.com/mohebifar/lebab/issues)
or voicing your opinion in existing one.

Want to contribute?  [Read how Lebab looks for patterns in syntax trees.][pattern-matching]

[pattern-matching]: http://nene.github.io/2016/04/02/matches-ast
[88]: https://github.com/lebab/lebab/issues/88
[107]: https://github.com/lebab/lebab/issues/107
[113]: https://github.com/lebab/lebab/issues/113
[125]: https://github.com/lebab/lebab/issues/125
[127]: https://github.com/lebab/lebab/issues/127
[131]: https://github.com/lebab/lebab/issues/131
[145]: https://github.com/lebab/lebab/issues/145
[158]: https://github.com/lebab/lebab/issues/158
[166]: https://github.com/lebab/lebab/issues/166
[168]: https://github.com/lebab/lebab/issues/168
[186]: https://github.com/lebab/lebab/issues/186
[191]: https://github.com/lebab/lebab/issues/191
[200]: https://github.com/lebab/lebab/issues/200
[215]: https://github.com/lebab/lebab/issues/215
