import createTestHelpers from '../createTestHelpers';
const {expectTransform} = createTestHelpers(['class']);

export default function inheritanceTests() {
  // TODO: We *should* be checking that util is truly coming from require("util")
  it('should determine a function is a class when util.inherits is used', () => {
    expectTransform(
      'function MyClass() {\n' +
      '}\n' +
      'util.inherits(MyClass, OtherClass);'
    ).toReturn(
      'class MyClass extends OtherClass {}'
    );
  });

  it('should preserve util.inherits inheritance when the inherited class is a member expression', () => {
    expectTransform(
      'function MyClass() {\n' +
      '}\n' +
      'util.inherits(MyClass, Foo.Bar.OtherClass);'
    ).toReturn(
      'class MyClass extends Foo.Bar.OtherClass {}'
    );
  });
}
