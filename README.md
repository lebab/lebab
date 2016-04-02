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

Transpile your old-fashioned code using the `lebab` cli tool.

```bash
$ lebab es5.js -o es6.js
```

Or convert just the features of your choice:

```bash
$ lebab es5.js -o es6.js --enable let,arrow,commonjs
```


## Features and known limitations

- [x] **class** - function/prototypes to classes
    - [x] recognizes `Foo.prototype.method = function(){ ... };`
    - [x] recognizes `Foo.prototype = { ...methods... };`
    - [x] recognizes getters/setters defined with `Object.defineProperty()`
    - [ ] does not recognize classes without methods
    - [ ] does not recognize static methods
    - [ ] no support for extending classes
    - [ ] BUG [does not support namespaced classes](#113)
- [x] **template** - string concatenation to template strings
    - [x] converts variables and arbitrary expressions to `${...}`
    - [ ] BUG [removes indentation of multi-line strings](#88)
    - [ ] BUG [ignores difference between `.toString()` and `.valueOf()`](#107)
- [x] **arrow** - callbacks to arrow functions
    - [x] Converts bound functions like `function(){}.bind(this)`
    - [x] not applied to unbound functions that use `this`
    - [x] not applied to functions that use `arguments`
    - [x] not applied to object properties (use `obj-method` transform)
    - [x] converts immediate return `{ return x; }` to `=> x`
    - [ ] does not remove `that = this` assignments
    - [ ] BUG [fails with immediately returning functions that have methods invoked](#105)
- [x] **let** - `var` to `let`/`const`
    - [x] never modified variables are converted to `const`
    - [x] properly recognizes block-scoping
    - [ ] vars that conflict with block-scoping are not converted
    - [ ] BUG [treats existing `let`/`const` as `var`](#90)
    - [ ] BUG [does not recognize destructuring](#90)
- [x] **default-param** - default parameters instead of `a = a || 2`
    - [x] recognizes `a = a || 2`
    - [x] recognizes `a = a ? a : 2`
    - [x] recognizes `a = a === undefined ? 2 : a`
    - [x] recognizes `a = typeof a === 'undefined' ? 2 : a`
- [x] **arg-spread** - use of apply() to spread operator **(in next release)**
    - [x] recognizes `obj.method.apply(obj, args)`
    - [ ] does not convert plain `func.apply()`
- [x] **obj-method** - function values in object to methods
    - [ ] does not convert named function expressions
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


## What's next?

Which feature should Lebab implement next?
Let us know by [creating an issue](https://github.com/mohebifar/lebab/issues)
or voicing your opinion in existing one.
