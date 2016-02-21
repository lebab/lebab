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
- [x] **template** - string concatenation to template strings
    - [x] converts variables and arbitrary expressions to `${...}`
    - [ ] BUG #88: removes indentation of multi-line strings
- [x] **arrow** - callbacks to arrow functions
    - [x] not applied to functions that use `this` or `arguments`
    - [x] not applied to object properties (use `obj-method` transform)
    - [ ] does not remove `that = this` assignments
    - [ ] does not recognize bound functions like `function(){}.bind(this)`
- [x] **let** - `var` to `let`/`const`
    - [x] never modified variables are converted to `const`
    - [x] properly recognizes block-scoping
    - [ ] vars that conflict with block-scoping are not converted
    - [ ] BUG #90: treats existing `let`/`const` as `var`
    - [ ] BUG #90: does not recognize destructuring
- [x] **default-param** - default parameters instead of `a = a || 2`
    - [ ] BUG #90: removes existing default parameters
    - [ ] BUG #89: re-indents long parameter lists
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
    - [x] converts `module.exports = function(){}` to `export default function(){}`
    - [ ] only handles default imports and exports
    - [ ] only handles `require()` calls in `var` declarations
    - [ ] does not ensure that imported variable is treated as `const`
    - [ ] does not recognize imports/exports inside nested blocks/functions
    - [ ] does not recognize `var bar = require("foo").bar`
    - [ ] does not recognize destructuring


## Roadmap

- [ ] For of loops
- [ ] Convert arguments to rest parameters
- [ ] Lexical this for arrow functions
- [ ] Named parameters
- [ ] Destructing arrays
- [ ] Destructing objects
