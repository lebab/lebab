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


## Features

- **class** - function/prototypes to classes
- **template** - string concatenation to template strings
- **arrow** - callbacks to arrow functions
- **let** - `var` to `let`/`const`
- **default-param** - default parameters instead of `a = a || 2`
- **obj-method** - function values in object to methods
- **obj-shorthand** - `{foo: foo}` to `{foo}`
- **no-strict** - removal of `"use strict"` directives
- **commonjs** - CommonJS module definition to ES6 modules


## Roadmap

- [ ] For of loops
- [ ] Convert arguments to rest parameters
- [ ] Lexical this for arrow functions
- [ ] Named parameters
- [ ] Destructing arrays
- [ ] Destructing objects
