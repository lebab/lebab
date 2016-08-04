[![Build Status](https://img.shields.io/travis/mohebifar/lebab.svg?style=flat-square)](http://travis-ci.org/mohebifar/lebab)
[![License](http://img.shields.io/:license-mit-brightgreen.svg?style=flat-square)](http://mohebifar.mit-license.org)
[![JS.ORG](https://img.shields.io/badge/js.org-xto6-ffb400.svg?style=flat-square)](http://js.org)

# Lebab

![Lebab](https://raw.githubusercontent.com/mohebifar/lebab-logo/master/logo.png)

**Lebab** transpiles your ES5 code to ES2015.
It does exactly the opposite of what [Babel](https://babeljs.io/) does.
If you want to understand what Lebab exactly does, [try the live demo](http://lebab.io/try-it).


## Usage

Install it using npm:

```bash
$ npm install -g lebab
```

Convert your old-fashioned code using the `lebab` cli tool,
enabling a specific transformation:

```bash
$ lebab es5.js -o es6.js --transform let
```

Or transform an entire directory of files in-place:

```bash
$ lebab --replace src/js/ --transform arrow
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
The resulting ES2015 code should be almost 100% equivalent of the original code.

- [x] **arrow** - callbacks to arrow functions
    - [x] Converts bound functions like `function(){}.bind(this)`
    - [x] not applied to unbound functions that use `this`
    - [x] not applied to functions that use `arguments`
    - [x] not applied to object properties (use `obj-method` transform)
    - [x] converts immediate return `{ return x; }` to `=> x`
    - [ ] does not remove `that = this` assignments
    - [ ] BUG [fails with immediately returning functions that have methods invoked][105]
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
- [x] **commonjs** - CommonJS module definition to ES6 modules
    - [x] converts `var foo = require("foo")` to `import foo from "foo"`
    - [x] converts `var bar = require("foo").bar` to `import {bar} from "foo"`
    - [x] converts `var {bar} = require("foo")` to `import {bar} from "foo"`
    - [ ] only handles `require()` calls in `var` declarations
    - [ ] does not ensure that imported variable is treated as `const`
    - [x] converts `module.exports = <anything>` to `export default <anything>`
    - [x] converts `exports.foo = function(){}` to `export function foo(){}`
    - [x] converts `exports.Foo = class {}` to `export class Foo {}`
    - [x] converts `exports.foo = 123` to `export var foo = 123`
    - [x] converts `exports.foo = bar` to `export {bar as foo}`
    - [ ] does not check if named export conflicts with existing variable names
    - [ ] does not recognize imports/exports inside nested blocks/functions

### Unsafe transforms

These transforms should be applied with caution.
They use heuristics to detect common patterns that can be expressed with ES2015 syntax.
There are no guarantees that the resulting code is equivalent of the original code.

- [x] **class** - function/prototypes to classes
    - [x] recognizes `Foo.prototype.method = function(){ ... };`
    - [x] recognizes `Foo.prototype = { ...methods... };`
    - [x] recognizes static methods like `Foo.method = function(){ ... };`
    - [x] recognizes getters/setters defined with `Object.defineProperty()`
    - [ ] does not recognize classes without methods
    - [ ] no support for extending classes
    - [ ] LIMITATION [does not support namespaced classes][113]
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

### ES7 transforms

A single transform for the single ES7 syntax feature.

- [x] **exponent** - `Math.pow()` to `**` operator


## Programming API

Simply import and call `lebab.transform()`:

```js
import lebab from 'lebab';
const {code, warnings} = lebab.transform('var f = function(){};', ['let', 'arrow']);
console.log(code); // -> "const f = () => {};"
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

- [Atom](https://github.com/ga2mer/atom-lebab)
- [Sublime](https://github.com/inkless/lebab-sublime) (does not work with Lebab 2.0)


## What's next?

Which feature should Lebab implement next?
Let us know by [creating an issue](https://github.com/mohebifar/lebab/issues)
or voicing your opinion in existing one.

Want to contribute?  [Read how Lebab looks for patterns in syntax trees.][pattern-matching]

[pattern-matching]: http://nene.github.io/2016/04/02/matches-ast
[88]: https://github.com/mohebifar/lebab/issues/88
[105]: https://github.com/mohebifar/lebab/issues/105
[107]: https://github.com/mohebifar/lebab/issues/107
[113]: https://github.com/mohebifar/lebab/issues/113
[125]: https://github.com/mohebifar/lebab/issues/125
[127]: https://github.com/mohebifar/lebab/issues/127
[131]: https://github.com/mohebifar/lebab/issues/131
