import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['class']);

describe('Classes', () => {
  it('should not convert functions without prototype assignment to class', () => {
    expectNoChange(
      'function myFunc() {\n' +
      '}'
    ).withoutWarnings();
  });

  it('should warn about functions that are named like classes', () => {
    expectNoChange(
      'function MyClass() {\n' +
      '}'
    ).withWarnings([
      {line: 1, msg: 'Function MyClass looks like class, but has no prototype', type: 'class'}
    ]);
  });

  it('should convert static function declarations with assignment to static class methods', () => {
    expectTransform(
      'function MyClass() {\n' +
      '}\n' +
      'MyClass.method = function(a, b) {\n' +
      '};'
    ).toReturn(
      'class MyClass {\n' +
      '  static method(a, b) {\n' +
      '  }\n' +
      '}'
    );
  });

  it('should ignore anonymous function declaration', () => {
    expectNoChange(
      'export default function () {}'
    );
  });

  describe('assignment to prototype field', () => {
    it('should convert to class (when function declaration used)', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = function(a, b) {\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  method(a, b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should convert to class (when function variable used)', () => {
      expectTransform(
        'var MyClass = function() {\n' +
        '};\n' +
        'MyClass.prototype.method = function() {\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  method() {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should not convert arrow-function to class', () => {
      expectNoChange(
        'var MyClass = () => {\n' +
        '  this.foo = 10;\n' +
        '};\n' +
        'MyClass.prototype.method = () => {\n' +
        '  return this.foo;\n' +
        '};'
      );
    });

    it('should not convert arrow-function to method when it uses this', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = () => {\n' +
        '  return this.foo;\n' +
        '};'
      );
    });

    it('should not convert arrow-function to method when it uses this inside nested arrow-function', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = () => {\n' +
        '  return () => { this.foo(); };\n' +
        '};'
      );
    });

    it('should convert arrow-function to method when it does not use this', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = () => {\n' +
        '  return foo;\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  method() {\n' +
        '    return foo;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should convert shorthand arrow-function to method when it does not use this', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = () => foo;'
      ).toReturn(
        'class MyClass {\n' +
        '  method() {\n' +
        '    return foo;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should convert non-empty function to constructor method', () => {
      expectTransform(
        'function MyClass(a, b) {\n' +
        '  this.params = [a, b];\n' +
        '}\n' +
        'MyClass.prototype.method = function(ma, mb) {\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  constructor(a, b) {\n' +
        '    this.params = [a, b];\n' +
        '  }\n' +
        '\n' +
        '  method(ma, mb) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should preserve "async" keyword when converting methods', () => {
      expectTransform(
        'function MyClass(a, b) {\n' +
        '  this.params = [a, b];\n' +
        '}\n' +
        'MyClass.prototype.method = async function(ma, mb) {\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  constructor(a, b) {\n' +
        '    this.params = [a, b];\n' +
        '  }\n' +
        '\n' +
        '  async method(ma, mb) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should not convert non-anonymous functions to methods', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = method;\n' +
        'function method(a, b) {\n' +
        '}'
      );
    });

    it('should ignore non-function assignments to prototype', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.count = 10;\n' +
        'MyClass.prototype.method = function() {\n' +
        '};\n' +
        'MyClass.prototype.hash = {foo: "bar"};'
      ).toReturn(
        'class MyClass {\n' +
        '  method() {\n' +
        '  }\n' +
        '}\n' +
        '\n' +
        'MyClass.prototype.count = 10;\n' +
        'MyClass.prototype.hash = {foo: "bar"};'
      );
    });
  });

  describe('object assigned to prototype', () => {
    it('should transform plain functions to methods', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  methodA: function(a) {\n' +
        '  },\n' +
        '  methodB: function(b) {\n' +
        '  }\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  methodA(a) {\n' +
        '  }\n' +
        '\n' +
        '  methodB(b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should move over ES6 methods', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  methodA(a) {\n' +
        '  },\n' +
        '  methodB(b) {\n' +
        '  }\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  methodA(a) {\n' +
        '  }\n' +
        '\n' +
        '  methodB(b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should move over getters/setters', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  get methodA() {\n' +
        '  },\n' +
        '  set methodB(b) {\n' +
        '  }\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  get methodA() {\n' +
        '  }\n' +
        '\n' +
        '  set methodB(b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should ignore when it contains non-functions', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  method: function(a) {\n' +
        '  },\n' +
        '  foo: 10\n' +
        '};'
      );
    });

    it('should ignore when it contains arrow-functions that use this', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  method: () => this.foo,\n' +
        '};'
      );
    });

    it('should transform when it contains arrow-functions that do not use this', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  method: () => foo,\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  method() {\n' +
        '    return foo;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should preserve "async" when converting arrow-functions', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = {\n' +
        '  method: async () => foo,\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  async method() {\n' +
        '    return foo;\n' +
        '  }\n' +
        '}'
      );
    });
  });

  describe('Object.defineProperty', () => {
    it('should convert setters and getters', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'Object.defineProperty(MyClass.prototype, "someAccessor", {\n' +
        '  get: function () {\n' +
        '    return this._some;\n' +
        '  },\n' +
        '  set: function (value) {\n' +
        '    this._some = value;\n' +
        '  }\n' +
        '});'
      ).toReturn(
        'class MyClass {\n' +
        '  get someAccessor() {\n' +
        '    return this._some;\n' +
        '  }\n' +
        '\n' +
        '  set someAccessor(value) {\n' +
        '    this._some = value;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should ignore other options when converting get/set', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'Object.defineProperty(MyClass.prototype, "someAccessor", {\n' +
        '  configurable: true,\n' +
        '  enumerable: true,\n' +
        '  set: function (value) {\n' +
        '    this._some = value;\n' +
        '  }\n' +
        '});'
      ).toReturn(
        'class MyClass {\n' +
        '  set someAccessor(value) {\n' +
        '    this._some = value;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should ignore non-function property', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'Object.defineProperty(MyClass.prototype, "propName", {\n' +
        '  value: 10,\n' +
        '  configurable: true,\n' +
        '  writable: true\n' +
        '});'
      );
    });

    it('should transform arrow-function that does not use this', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'Object.defineProperty(MyClass.prototype, "getter", {\n' +
        '  get: () => something\n' +
        '});'
      ).toReturn(
        'class MyClass {\n' +
        '  get getter() {\n' +
        '    return something;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should ignore arrow-function that uses this', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'Object.defineProperty(MyClass.prototype, "getter", {\n' +
        '  get: () => this.something\n' +
        '});'
      );
    });
  });

  describe('comments', () => {
    it('should preserve class comments', () => {
      expectTransform(
        '/** My nice class. */\n' +
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.method = function(a, b) {\n' +
        '};'
      ).toReturn(
        '/** My nice class. */\n' +
        'class MyClass {\n' +
        '  method(a, b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should preserve method comments', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        '/** My nice method. */\n' +
        'MyClass.prototype.method = function(a, b) {\n' +
        '};'
      ).toReturn(
        'class MyClass {\n' +
        '  /** My nice method. */\n' +
        '  method(a, b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should preserve class with constructor comments', () => {
      expectTransform(
        '/** My nice class. */\n' +
        'function MyClass() {\n' +
        '  this.foo = 1;\n' +
        '}\n' +
        'MyClass.prototype.method = function(a, b) {\n' +
        '};'
      ).toReturn(
        '/** My nice class. */\n' +
        'class MyClass {\n' +
        '  constructor() {\n' +
        '    this.foo = 1;\n' +
        '  }\n' +
        '\n' +
        '  method(a, b) {\n' +
        '  }\n' +
        '}'
      );
    });

    it('should preserve multiple comments in various places', () => {
      expectTransform(
        '// My class\n' +
        '// it is nice\n' +
        'function MyClass() {\n' +
        '}\n' +
        '// comment after constructor-function\n' +
        '\n' +
        '// Look me, a method!\n' +
        '// it is nice too\n' +
        'MyClass.prototype.method = function(a, b) {\n' +
        '};\n' +
        '// and even some comments in here'
      ).toReturn(
        '// My class\n' +
        '// it is nice\n' +
        'class MyClass {\n' +
        '  // comment after constructor-function\n' +
        '\n' +
        '  // Look me, a method!\n' +
        '  // it is nice too\n' +
        '  method(a, b) {\n' +
        '  }\n' +
        '  // and even some comments in here\n' +
        '}'
      );
    });

    it('should preserve prototype = {} comments', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        '// comment before\n' +
        'MyClass.prototype = {\n' +
        '  // comment A\n' +
        '  methodA: function() {},\n' +
        '  // comment B\n' +
        '  methodB: function() {}\n' +
        '};\n'
      ).toReturn(
        'class MyClass {\n' +
        '  // comment before\n' +
        '  // comment A\n' +
        '  methodA() {}\n' +
        '\n' +
        '  // comment B\n' +
        '  methodB() {}\n' +
        '}\n'
      );
    });

    it('should preserve Object.defineProperty comments', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        '// Comment before\n' +
        'Object.defineProperty(MyClass.prototype, "someAccessor", {\n' +
        '  // Getter comment\n' +
        '  get: function() {},\n' +
        '  // Setter comment\n' +
        '  set: function() {}\n' +
        '});'
      ).toReturn(
        'class MyClass {\n' +
        '  // Comment before\n' +
        '  // Getter comment\n' +
        '  get someAccessor() {}\n' +
        '\n' +
        '  // Setter comment\n' +
        '  set someAccessor() {}\n' +
        '}'
      );
    });
  });
});
