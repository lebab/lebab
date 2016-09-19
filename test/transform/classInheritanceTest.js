import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['class']);

describe('Class Inheritance', () => {
  describe('node.js util.inherits', () => {
    it('determines a function is a class when util.inherits() is used', () => {
      expectTransform(
        'var util2 = require("util");\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util2.inherits(MyClass, ParentClass);'
      ).toReturn(
        'var util2 = require("util");\n' +
        'class MyClass extends ParentClass {}'
      );
    });

    it('tracks assignment of require("util").inherits', () => {
      expectTransform(
        'var inherits2 = require("util").inherits;\n' +
        'function MyClass() {\n' +
        '}\n' +
        'inherits2(MyClass, ParentClass);'
      ).toReturn(
        'var inherits2 = require("util").inherits;\n' +
        'class MyClass extends ParentClass {}'
      );
    });

    it('supports import from "util"', () => {
      expectTransform(
        'import util from "util";\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, ParentClass);'
      ).toReturn(
        'import util from "util";\n' +
        'class MyClass extends ParentClass {}'
      );
    });

    it('ignores import of anything else than "util"', () => {
      expectNoChange(
        'import util from "./util";\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, ParentClass);'
      );
    });

    it('ignores named imports from "util"', () => {
      expectNoChange(
        'import {util} from "util";\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, ParentClass);'
      );
    });

    it('preserves inheritance when the inherited class is a member expression', () => {
      expectTransform(
        'var util = require("util");\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, Foo.Bar.ParentClass);'
      ).toReturn(
        'var util = require("util");\n' +
        'class MyClass extends Foo.Bar.ParentClass {}'
      );
    });

    it('ignores require("util") which is not top-level', () => {
      expectNoChange(
        'function foo() {\n' +
        '  var util = require("util");\n' +
        '}\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, Foo.Bar.ParentClass);'
      );
    });

    it('ignores util.inherits() when not from require("util")', () => {
      expectNoChange(
        'var util = require("./util");\n' +
        'function MyClass() {\n' +
        '}\n' +
        'util.inherits(MyClass, ParentClass);'
      );
      expectNoChange(
        'var inherits = require("./util").inherits;\n' +
        'function MyClass() {\n' +
        '}\n' +
        'inherits(MyClass, ParentClass);'
      );
    });
  });

  describe('prototype = new ParentClass()', () => {
    it('determines a function is a class', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();'
      ).toReturn(
        'class MyClass extends ParentClass {}'
      );
    });

    it('discards the prototype.constructor assignment', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();\n' +
        'MyClass.prototype.constructor = MyClass;'
      ).toReturn(
        'class MyClass extends ParentClass {}'
      );
    });

    it('ignores bogus prototype.constructor assignments', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();\n' +
        'ParentClass.prototype.constructor = MyClass;\n' +
        'MyClass.prototype.constructor = ParentClass;'
      ).toReturn(
        'class MyClass extends ParentClass {}\n' +
        'ParentClass.prototype.constructor = MyClass;\n' +
        'MyClass.prototype.constructor = ParentClass;'
      );
    });

    it('does not detect inheritance from prototype.constructor assignment alone', () => {
      expectNoChange(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype.constructor = MyClass;'
      );
    });
  });

  describe('prototype = Object.create(ParentClass.prototype)', () => {
    it('determines a function is a class', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = Object.create(ParentClass.prototype);'
      ).toReturn(
        'class MyClass extends ParentClass {}'
      );
    });

    it('discards the prototype.constructor assignment', () => {
      expectTransform(
        'function MyClass() {\n' +
        '}\n' +
        'MyClass.prototype = Object.create(ParentClass.prototype);\n' +
        'MyClass.prototype.constructor = MyClass;'
      ).toReturn(
        'class MyClass extends ParentClass {}'
      );
    });
  });

  describe('super() calls in constructor', () => {
    it('converts ParentClass.call(this, args...) to super()', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '  ParentClass.call(this, name);\n' +
        '  this.name = name;\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();'
      ).toReturn(
        'class MyClass extends ParentClass {\n' +
        '  constructor(name) {\n' +
        '    super(name);\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '}'
      );
    });

    it('does not convert ParentClass.call(args...) without this to super() ', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '  ParentClass.call(null, name);\n' +
        '  this.name = name;\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();'
      ).toReturn(
        'class MyClass extends ParentClass {\n' +
        '  constructor(name) {\n' +
        '    ParentClass.call(null, name);\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '}'
      );
    });

    it('converts nested ParentClass.call(this, args...) in constructor to super()', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '  if (true)\n' +
        '    ParentClass.call(this);\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();'
      ).toReturn(
        'class MyClass extends ParentClass {\n' +
        '  constructor(name) {\n' +
        '    if (true)\n' +
        '      super();\n' +
        '  }\n' +
        '}'
      );
    });
  });

  describe('super.foo() calls in methods', () => {
    it('converts ParentClass.prototype.foo.call(this, args...) to super.foo()', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();\n' +
        'MyClass.prototype.foo = function(a, b, c) {\n' +
        '  ParentClass.prototype.foo.call(this, a, b, c);\n' +
        '  this.doSomethingElse();\n' +
        '};'
      ).toReturn(
        'class MyClass extends ParentClass {\n' +
        '  foo(a, b, c) {\n' +
        '    super.foo(a, b, c);\n' +
        '    this.doSomethingElse();\n' +
        '  }\n' +
        '}'
      );
    });

    it('converts nested ParentClass.prototype.foo.call(this, args...) to super.foo()', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();\n' +
        'MyClass.prototype.bar = function() {\n' +
        '  if (someCondition)\n' +
        '    ParentClass.prototype.foo.call(this);\n' +
        '};'
      ).toReturn(
        'class MyClass extends ParentClass {\n' +
        '  bar() {\n' +
        '    if (someCondition)\n' +
        '      super.foo();\n' +
        '  }\n' +
        '}'
      );
    });

    it('does not convert SomeOtherClass.prototype.foo.call(this, args...) to super.foo()', () => {
      expectTransform(
        'function MyClass(name) {\n' +
        '}\n' +
        'MyClass.prototype = new ParentClass();\n' +
        'MyClass.prototype.foo = function() {\n' +
        '  SomeOtherClass.prototype.foo.call(this);\n' +
        '};'
      ).toReturn(
        'class MyClass extends ParentClass {\n' +
        '  foo() {\n' +
        '    SomeOtherClass.prototype.foo.call(this);\n' +
        '  }\n' +
        '}'
      );
    });
  });
});
