import createTestHelpers from '../createTestHelpers';
const {expectTransform} = createTestHelpers(['for-of']);

describe('For loops to for-of', () => {
  describe('with existing array element alias', () => {
    it('should use the existing alias as loop variable', () => {
      expectTransform(
        'for (var i=0; i < array.length; i++) {\n' +
        '  var item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (var item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should work with different variables and long for-loop body', () => {
      expectTransform(
        'for (var idx=0; idx < fruitList.length; idx++) {\n' +
        '  var fruit = fruitList[idx];\n' +
        '  var price = getCurrentPrice(fruit);\n' +
        '  if (price > fruit.standardPrice) {\n' +
        '    sell(fruit, price);\n' +
        '  }\n' +
        '}'
      ).toReturn(
        'for (var fruit of fruitList) {\n' +
        '  var price = getCurrentPrice(fruit);\n' +
        '  if (price > fruit.standardPrice) {\n' +
        '    sell(fruit, price);\n' +
        '  }\n' +
        '}'
      );
    });

    it('should preserve original let-kind of loop variable', () => {
      expectTransform(
        'for (var i=0; i < array.length; i++) {\n' +
        '  let item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (let item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should preserve original const-kind of loop variable', () => {
      expectTransform(
        'for (var i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (const item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should ignore the kind of original index variable', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  var item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (var item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });
  });
});
