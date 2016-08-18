import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['for-of']);

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

    it('should support complex expressions for array', () => {
      expectTransform(
        'for (var i=0; i < store[current].fruits.length; i++) {\n' +
        '  var item = store[current].fruits[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (var item of store[current].fruits) {\n' +
        '  console.log(item);\n' +
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

    it('should transform ++i loop-increment', () => {
      expectTransform(
        'for (var i=0; i < array.length; ++i) {\n' +
        '  var item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (var item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should transform i+=1 loop-increment', () => {
      expectTransform(
        'for (var i=0; i < array.length; i+=1) {\n' +
        '  var item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (var item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should not transform when index variable used in loop body', () => {
      expectNoChange(
        'for (let i=0; i < array.length; i++) {\n' +
        '  var item = array[i];\n' +
        '  console.log(item, i);\n' +
        '}'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
      ]);
    });

    it('should not transform when index variable used inside a function in loop body', () => {
      expectNoChange(
        'for (let i=0; i < array.length; i++) {\n' +
        '  var item = array[i];\n' +
        '  callback(function(){ return i; });\n' +
        '}'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
      ]);
    });

    it('should not transform when loop initializes several variables', () => {
      expectNoChange(
        'for (var i=0, j=0; i < array.length; i++) {\n' +
        '  var item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).withWarnings([
        {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
      ]);
    });
  });
});
