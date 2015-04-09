#[![Build Status](https://img.shields.io/travis/mohebifar/xto6.svg)](http://travis-ci.org/mohebifar/xto6) [![License](http://img.shields.io/:license-mit-brightgreen.svg?style=flat)](http://mohebifar.mit-license.org) 

# xto6
![xto6](https://raw.githubusercontent.com/mohebifar/xto6-logo/master/logo.png)

**xto6** transpiles your ES5 code to ES6. It does exactly the opposite of what other transpilers do (like babel and traceur)! If you want to understand what xto6 exactly does, [try the live demo](https://mohebifar.github.io/xto6/#try-live).

## Why ?
Still coding this way ? Think twice !

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
$ npm install -g xto6
```

Transpile your old-fashioned code using the `xto6` cli tool.
```bash
xto6 es5.js -o es6.js
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
