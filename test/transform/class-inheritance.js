import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['class']);

export default function inheritanceTests() {
  describe('Inheritance', () => {
    describe('node.js require(\'util\').inherits', () => {
      it('should determine a function is a class when util.inherits is used', () => {
        expectTransform(
          'var util2 = require(\'util\');\n' +
          'function MyClass() {\n' +
          '}\n' +
          'util2.inherits(MyClass, OtherClass);'
        ).toReturn(
          'var util2 = require(\'util\');\n' +
          'class MyClass extends OtherClass {}'
        );
        expectTransform(
          'var inherits2 = require(\'util\').inherits;\n' +
          'function MyClass() {\n' +
          '}\n' +
          'inherits2(MyClass, OtherClass);'
        ).toReturn(
          'var inherits2 = require(\'util\').inherits;\n' +
          'class MyClass extends OtherClass {}'
        );
      });

      it('should preserve util.inherits inheritance when the inherited class is a member expression', () => {
        expectTransform(
          'var util = require(\'util\');\n' +
          'function MyClass() {\n' +
          '}\n' +
          'util.inherits(MyClass, Foo.Bar.OtherClass);'
        ).toReturn(
          'var util = require(\'util\');\n' +
          'class MyClass extends Foo.Bar.OtherClass {}'
        );
      });

      it('should ignore inherits when not from require(\'util\')', () => {
        expectNoChange(
          'var util = require(\'./util\');\n' +
          'function MyClass() {\n' +
          '}\n' +
          'util.inherits(MyClass, OtherClass);'
        );
        expectNoChange(
          'var inherits = require(\'./util\').inherits;\n' +
          'function MyClass() {\n' +
          '}\n' +
          'inherits(MyClass, OtherClass);'
        );
      });
    });
  });
}
