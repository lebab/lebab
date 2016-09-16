import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['class']);

describe('Class Inheritance', () => {
  describe('node.js require("util").inherits', () => {
    it('determines a function is a class when require("util").inherits is used', () => {
      expectTransform(
        'var util2 = require("util");\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util2.inherits(MyClass, OtherClass);'
      ).toReturn(
        'var util2 = require("util");\n' +
        'class MyClass extends OtherClass {}'
      );
    });

    it('tracks assignment of require("util").inherits', () => {
      expectTransform(
        'var inherits2 = require("util").inherits;\n' +
        'function MyClass() {\n' +
        '}\n' +
        'inherits2(MyClass, OtherClass);'
      ).toReturn(
        'var inherits2 = require("util").inherits;\n' +
        'class MyClass extends OtherClass {}'
      );
    });

    it('preserves inheritance when the inherited class is a member expression', () => {
      expectTransform(
        'var util = require("util");\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, Foo.Bar.OtherClass);'
      ).toReturn(
        'var util = require("util");\n' +
        'class MyClass extends Foo.Bar.OtherClass {}'
      );
    });

    it('ignores util requires which are not top-level', () => {
      expectNoChange(
        'function foo() {\n' +
        '  var util = require("util");\n' +
        '}\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, Foo.Bar.OtherClass);'
      );
    });

    it('should ignore inherits when not from require("util")', () => {
      expectNoChange(
        'var util = require("./util");\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, OtherClass);'
      );
      expectNoChange(
        'var inherits = require("./util").inherits;\n' +
        'function MyClass() {\n' +
        '}\n' +
        'inherits(MyClass, OtherClass);'
      );
    });

    it('should convert constructor .call(this, args...) to super()', () => {
      expectTransform(
        'var inherits = require("util").inherits;\n' +
        'function MyClass(name) {\n' +
        '  OtherClass.call(this, name);\n' +
        '  this.name = name;\n' +
        '}\n' +
        'inherits(MyClass, OtherClass);'
      ).toReturn(
        'var inherits = require("util").inherits;\n' +
        '\n' +
        'class MyClass extends OtherClass {\n' +
        '  constructor(name) {\n' +
        '    super(name);\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should not convert constructor .call(args...) to super() ', () => {
      // If we call the parent constructor with no `this` then we will not convert to a super call.
      expectTransform(
        'var inherits = require("util").inherits;\n' +
        'function MyClass(name) {\n' +
        '  OtherClass.call(null, name);\n' +
        '  this.name = name;\n' +
        '}\n' +
        'inherits(MyClass, OtherClass);'
      ).toReturn(
        'var inherits = require("util").inherits;\n' +
        '\n' +
        'class MyClass extends OtherClass {\n' +
        '  constructor(name) {\n' +
        '    OtherClass.call(null, name);\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should convert nested constructor .call(this, args...) to super()', () => {
      expectTransform(
        'var inherits = require("util").inherits;\n' +
        'function MyClass(name) {\n' +
        '  if (true)\n' +
        '    OtherClass.call(this);\n' +
        '}\n' +
        'inherits(MyClass, OtherClass);'
      ).toReturn(
        'var inherits = require("util").inherits;\n' +
        '\n' +
        'class MyClass extends OtherClass {\n' +
        '  constructor(name) {\n' +
        '    if (true)\n' +
        '      super();\n' +
        '  }\n' +
        '}'
      );
    });
  });

  describe('prototype', () => {
    it('should preserve inheritance when prototype is created using new', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = new OtherClass();'
      ).toReturn(
        'class MyClass extends OtherClass {}'
      );
    });

    it('should discard the prototype.constructor assignment', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = new OtherClass();\n' +
        'MyClass.prototype.constructor = MyClass;'
      ).toReturn(
        'class MyClass extends OtherClass {}'
      );
    });

    it('should not detect inheritance from prototype.constructor assignment alone', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.constructor = MyClass;'
      );
    });

    it('should preserve inheritance when prototype is created using Object.create()', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = Object.create(OtherClass.prototype);'
      ).toReturn(
        'class MyClass extends OtherClass {}'
      );
    });

    it('should convert constructor .call(this, args...) to super()', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '  OtherClass.call(this, name);\n' +
        '  this.name = name;\n' +
        '}\n' +
        'MyClass.prototype = new OtherClass();'
      ).toReturn(
        'class MyClass extends OtherClass {\n' +
        '  constructor(name) {\n' +
        '    super(name);\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '}'
      );
    });

    it('should not convert constructor .call(args...) to super() ', () => {
      // If we call the parent constructor with no `this` then we will not convert to a super call.
      expectTransform(
        'function MyClass(name) {\n' +
        '  OtherClass.call(null, name);\n' +
        '  this.name = name;\n' +
        '}\n' +
        'MyClass.prototype = new OtherClass();'
      ).toReturn(
        'class MyClass extends OtherClass {\n' +
        '  constructor(name) {\n' +
        '    OtherClass.call(null, name);\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '}'
      );
    });
  });
});
