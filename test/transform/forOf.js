import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['for-of']);

describe('For loops to for-of', () => {
  describe('with existing array element alias', () => {
    it('should use the existing alias as loop variable', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  let item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (let item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should work with different variables and long for-loop body', () => {
      expectTransform(
        'for (let idx=0; idx < fruitList.length; idx++) {\n' +
        '  let fruit = fruitList[idx];\n' +
        '  let price = getCurrentPrice(fruit);\n' +
        '  if (price > fruit.standardPrice) {\n' +
        '    sell(fruit, price);\n' +
        '  }\n' +
        '}'
      ).toReturn(
        'for (let fruit of fruitList) {\n' +
        '  let price = getCurrentPrice(fruit);\n' +
        '  if (price > fruit.standardPrice) {\n' +
        '    sell(fruit, price);\n' +
        '  }\n' +
        '}'
      );
    });

    it('should support complex expressions for array', () => {
      expectTransform(
        'for (let i=0; i < store[current].fruits.length; i++) {\n' +
        '  let item = store[current].fruits[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (let item of store[current].fruits) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should preserve original const-kind of loop variable', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (const item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should transform ++i loop-increment', () => {
      expectTransform(
        'for (let i=0; i < array.length; ++i) {\n' +
        '  let item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (let item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should transform i+=1 loop-increment', () => {
      expectTransform(
        'for (let i=0; i < array.length; i+=1) {\n' +
        '  let item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'for (let item of array) {\n' +
        '  console.log(item);\n' +
        '}'
      );
    });

    it('should transform when index identifier used as object literal key', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  let item = array[i];\n' +
        '  console.log(item, {i: 123});\n' +
        '}'
      ).toReturn(
        'for (let item of array) {\n' +
        '  console.log(item, {i: 123});\n' +
        '}'
      );
    });

    it('should transform when index identifier used as object property', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  let item = array[i];\n' +
        '  console.log(item.i);\n' +
        '}'
      ).toReturn(
        'for (let item of array) {\n' +
        '  console.log(item.i);\n' +
        '}'
      );
    });

    describe('should not transform', () => {
      it('when index variable used in loop body', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item, i);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Index variable used in for-loop body', type: 'for-of'}
        ]);
      });

      it('when index variable used inside a function in loop body', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  callback(function(){ return i; });\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Index variable used in for-loop body', type: 'for-of'}
        ]);
      });

      it('when loop variable defined with var', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  var item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Only for-loops with let/const can be tranformed (use let transform first)', type: 'for-of'}
        ]);
      });

      it('when loop index variable defined with var', () => {
        expectNoChange(
          'for (var i=0; i < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Only for-loops with let/const can be tranformed (use let transform first)', type: 'for-of'}
        ]);
      });

      it('when loop initializes several variables', () => {
        expectNoChange(
          'for (let i=0, j=0; i < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
        ]);
      });

      it('when loop runs backwards', () => {
        expectNoChange(
          'for (let i = array.length-1; i >= 0; i--) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
        ]);
      });

      it('when elements taken from different array', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  let item = otherArray[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
        ]);
      });

      it('when elements taken from different index', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  let item = array[otherIndex];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
        ]);
      });

      it('when incrementing a different index', () => {
        expectNoChange(
          'for (let i=0; i < array.length; otherIndex++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
        ]);
      });

      it('when comparing a different index', () => {
        expectNoChange(
          'for (let i=0; otherIndex < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-of'}
        ]);
      });
    });

    describe('comments', () => {
      it('should preserve for-loop comments', () => {
        expectTransform(
          '// Some comments\n' +
          'for (let i=0; i < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item.i);\n' +
          '}'
        ).toReturn(
          '// Some comments\n' +
          'for (let item of array) {\n' +
          '  console.log(item.i);\n' +
          '}'
        );
      });

      it('should preserve loop variable comments', () => {
        expectTransform(
          'for (let i=0; i < array.length; i++) {\n' +
          '  // Some comments\n' +
          '  let item = array[i];\n' +
          '  console.log(item.i);\n' +
          '}'
        ).toReturn(
          '// Some comments\n' +
          'for (let item of array) {\n' +
          '  console.log(item.i);\n' +
          '}'
        );
      });
    });
  });
});
