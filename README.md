#[![Build Status](https://img.shields.io/travis/mohebifar/xto6.svg)](http://travis-ci.org/mohebifar/xto6) [![License](http://img.shields.io/:license-mit-brightgreen.svg?style=flat)](http://mohebifar.mit-license.org) 

# xto6
![xto6](https://raw.githubusercontent.com/mohebifar/xto6-logo/master/logo.png)

**xto6** transpiles your ES5 code to ES6. It works like other available transpilers (like babel and traceur) but in reverse order! If you want to understand what xto6 exactly does, [try the live demo](https://mohebifar.github.io/xto6/#try-live).

## Why ?
Still coding this way ? Think twice !

```js
var someClass = function () {
  console.log('This is the constructor.');
};

someClass.prototype.someOuterMethod = someFunction;

someClass.prototype.someInnerMethod = function (s, o, m, e, a, r, g) {
  var result = s + o + m + e + a + r + g;
  console.log(result);
  return result;
};

Object.defineProperty(someClass.prototype, 'someAccessor', {
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
class someClass {
  constructor() {
    console.log('This is the constructor.');
  }

  someOuterMethod() {
    return someFunction.apply(this, arguments);
  }

  someInnerMethod(s, o, m, e, a, r, g) {
    var result = s + o + m + e + a + r + g;
    console.log(result);
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
