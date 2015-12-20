[![Build Status](https://img.shields.io/travis/mohebifar/lebab.svg?style=flat-square)](http://travis-ci.org/mohebifar/lebab) [![License](http://img.shields.io/:license-mit-brightgreen.svg?style=flat-square)](http://mohebifar.mit-license.org) [![JS.ORG](https://img.shields.io/badge/js.org-xto6-ffb400.svg?style=flat-square)](http://js.org)

# Lebab
![xto6](https://raw.githubusercontent.com/mohebifar/xto6-logo/master/logo.png)

**lebab** transpiles your ES5 code to ES6. It does exactly the opposite of what other transpilers do (like babel and traceur)! If you want to understand what lebab exactly does, [try the live demo](http://xto6.js.org/#try-live).

## Why?
Still coding this way? Think twice!

```js
var SomeClass = function () {
  console.log('This is the constructor.');
};

SomeClass.prototype.someOuterMethod = someFunction;

SomeClass.prototype.someInnerMethod = function (birthYear) {
  var result = 'Your Age is : ' + (2015 - birthYear) + ' and you were born in ' + birthYear;
  return result;
};

Object.defineProperty(SomeClass.prototype, 'someAccessor', {
  get: function () {
    return this._some;
  },
  set: function (value) {
    this._some = value;
  }
});

function someFunction(a, b) {
  return a + b;
}
```

## Usage
Install it using npm :

```bash
$ npm install -g lebab
```

Transpile your old-fashioned code using the `lebab` cli tool.
```bash
lebab es5.js -o es6.js
```

And the result for the code above is :

```js
class SomeClass {
  constructor() {
    console.log('This is the constructor.');
  }

  someOuterMethod() {
    return someFunction.apply(this, arguments);
  }

  someInnerMethod(birthYear) {
    var result = `Your Age is : ${ 2015 - birthYear } and you were born in ${ birthYear }`;
    return result;
  }

  get someAccessor() {
    return this._some;
  }

  set someAccessor(value) {
    this._some = value;
  }
}

function someFunction(a, b) {
  return a + b;
}
```

## Supported Features

* Function/Prototypes to Classes
* Callback to Arrow functions
* String concatenation to Template Strings
* Using `let` and `const` instead of `var`
* Default arguments instead of `a = a || 2`
* Function properties in objects to Object methods
