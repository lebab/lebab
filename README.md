# xto6

**xto6** transpiles your ES5 code to ES6.

## Why ?
Still coding in this way ? **Think twice !**

```js
var someClass = function () {
  console.log('This is the constructor.');
};

someClass.prototype.someMethod = function (someParam) {
  console.log('The parameter is : ' + someParam);
};

Object.defineProperty(someClass.prototype, 'someAccessor', {
  get: function () {
    return this._some;
  },
  set: function (value) {
    this._some = value;
  }
});
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

And the result for the above code is :

```js
class someClass {
    constructor() {
        console.log('This is the constructor.');
    }
    someMethod(someParam) {
        console.log('The parameter is : ' + someParam);
    }
    get someAccessor() {
        return this._some;
    }
    set someAccessor(value) {
        this._some = value;
    }
}
```
