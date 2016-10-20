import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['for-each']);

describe('For loops to for-each', () => {
  describe('with existing array element alias', () => {
    it('should use the existing alias as loop variable', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'array.forEach(item => {\n' +
        '  console.log(item);\n' +
        '});'
      );
    });

    it('should work with different variables and long for-loop body', () => {
      expectTransform(
        'for (let idx=0; idx < fruitList.length; idx++) {\n' +
        '  const fruit = fruitList[idx];\n' +
        '  const price = getCurrentPrice(fruit);\n' +
        '  if (price > fruit.standardPrice) {\n' +
        '    sell(fruit, price);\n' +
        '  }\n' +
        '}'
      ).toReturn(
        'fruitList.forEach(fruit => {\n' +
        '  const price = getCurrentPrice(fruit);\n' +
        '  if (price > fruit.standardPrice) {\n' +
        '    sell(fruit, price);\n' +
        '  }\n' +
        '});'
      );
    });

    it('should support complex expressions for array', () => {
      expectTransform(
        'for (let i=0; i < store[current].fruits.length; i++) {\n' +
        '  const item = store[current].fruits[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'store[current].fruits.forEach(item => {\n' +
        '  console.log(item);\n' +
        '});'
      );
    });

    it('should transform ++i loop-increment', () => {
      expectTransform(
        'for (let i=0; i < array.length; ++i) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'array.forEach(item => {\n' +
        '  console.log(item);\n' +
        '});'
      );
    });

    it('should transform i+=1 loop-increment', () => {
      expectTransform(
        'for (let i=0; i < array.length; i+=1) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item);\n' +
        '}'
      ).toReturn(
        'array.forEach(item => {\n' +
        '  console.log(item);\n' +
        '});'
      );
    });

    it('should transform when index identifier used as object literal key', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item, {i: 123});\n' +
        '}'
      ).toReturn(
        'array.forEach(item => {\n' +
        '  console.log(item, {i: 123});\n' +
        '});'
      );
    });

    it('should transform when index identifier used as object property', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item.i);\n' +
        '}'
      ).toReturn(
        'array.forEach(item => {\n' +
        '  console.log(item.i);\n' +
        '});'
      );
    });

    it('should transform when an array is used in the loop body', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(array);\n' +
        '}'
      ).toReturn(
        'array.forEach(item => {\n' +
        '  console.log(array);\n' +
        '});'
      );
    });

    it('should transform when index identifier used in loop body', () => {
      expectTransform(
        'for (let i=0; i < array.length; i++) {\n' +
        '  const item = array[i];\n' +
        '  console.log(item, i);\n' +
        '}'
      ).toReturn(
        'array.forEach((item, i) => {\n' +
        '  console.log(item, i);\n' +
        '});'
      );
    });

    describe('should transform when loop contains a break inside another', () => {
      it('switch statement', () => {
        expectTransform(
          'for (let i=0; i < xs.length; i++) {\n' +
          '  const x = xs[i];\n' +
          '  switch (x % 2) {\n' +
          '    case 0:\n' +
          '      console.log("even");\n' +
          '      break;\n' +
          '    default:\n' +
          '      console.log("odd");\n' +
          '  }\n' +
          '}'
        ).toReturn(
          'xs.forEach(x => {\n' +
          '  switch (x % 2) {\n' +
          '    case 0:\n' +
          '      console.log("even");\n' +
          '      break;\n' +
          '    default:\n' +
          '      console.log("odd");\n' +
          '  }\n' +
          '});'
        );
      });

      it('for loop', () => {
        expectTransform(
          'for (let i = 0; i < array.length; i++) {\n' +
          '  const x = array[i];\n' +
          '  console.log(x);\n' +
          '  for (let j = 0; j < x.length; j++) {\n' +
          '    const y = x[j];\n' +
          '    console.log(y);\n' +
          '    if (item == 2) {\n' +
          '      break;\n' +
          '    }\n' +
          '  }\n' +
          '}'
        ).toReturn(
          'array.forEach(x => {\n' +
          '  console.log(x);\n' +
          '  for (let j = 0; j < x.length; j++) {\n' +
          '    const y = x[j];\n' +
          '    console.log(y);\n' +
          '    if (item == 2) {\n' +
          '      break;\n' +
          '    }\n' +
          '  }\n' +
          '});'
        );
      });
    });

    describe('should not transform when loop itself contains a', () => {
      it('break statement', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  const item = array[i];\n' +
          '  if (item == 2) {\n' +
          '    break;\n' +
          '  }\n' +
          '}'
        ).withWarnings([
          {line: 4, msg: 'Break statement used in for-loop body', type: 'for-each'}
        ]);
      });

      it('continue statement', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  const item = array[i];\n' +
          '  continue;\n' +
          '}'
        ).withWarnings([
          {line: 3, msg: 'Continue statement used in for-loop body', type: 'for-each'}
        ]);
      });

      it('break statement with label', () => {
        expectNoChange(
          'loop1:\n' +
          'for (let i = 0; i < xs.length; i++) {\n' +
          '  const x = xs[i];\n' +
          '  loop2:\n' +
          '  for (let j = 0; j < ys.length; j++) {\n' +
          '    const y = ys[i];\n' +
          '    if (i === 1 && j === 1) {\n' +
          '      break loop1;\n' +
          '    }\n' +
          '    console.log("i = " + i + ", j = " + j);\n' +
          '  }\n' +
          '}'
        ).withWarnings([
          {line: 8, msg: 'Break statement with label used in for-loop body', type: 'for-each'},
          {line: 5, msg: 'Unable to transform for loop', type: 'for-each'},
        ]);
      });

      it('continue statement with label', () => {
        expectNoChange(
          'loop1:\n' +
          'for (let i = 0; i < xs.length; i++) {\n' +
          '  const x = xs[i];\n' +
          '  loop2:\n' +
          '  for (let j = 0; j < ys.length; j++) {\n' +
          '    const y = ys[i];\n' +
          '    if (i === 1 && j === 1) {\n' +
          '      continue loop1;\n' +
          '    }\n' +
          '    console.log("i = " + i + ", j = " + j);\n' +
          '  }\n' +
          '}'
        ).withWarnings([
          {line: 8, msg: 'Continue statement with label used in for-loop body', type: 'for-each'},
          {line: 5, msg: 'Unable to transform for loop', type: 'for-each'},
        ]);
      });

      it('when loop index variable defined with var', () => {
        expectNoChange(
          'for (var i=0; i < array.length; i++) {\n' +
          '  const item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Only for-loops with indexes declared as let can be tranformed (use let transform first)', type: 'for-each'}
        ]);
      });

      it('when loop array item variable defined with var', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  var item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Only for-loops with const array items can be tranformed (use let transform first)', type: 'for-each'}
        ]);
      });

      it('when loop array item variable defined with let', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  let item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Only for-loops with const array items can be tranformed (use let transform first)', type: 'for-each'}
        ]);
      });

      it('when loop initializes several variables', () => {
        expectNoChange(
          'for (let i=0, j=0; i < array.length; i++) {\n' +
          '  const item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-each'}
        ]);
      });

      it('when loop runs backwards', () => {
        expectNoChange(
          'for (let i = array.length-1; i >= 0; i--) {\n' +
          '  const item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-each'}
        ]);
      });

      it('when elements taken from different array', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  const item = otherArray[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-each'}
        ]);
      });

      it('when elements taken from different index', () => {
        expectNoChange(
          'for (let i=0; i < array.length; i++) {\n' +
          '  const item = array[otherIndex];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-each'}
        ]);
      });

      it('when incrementing a different index', () => {
        expectNoChange(
          'for (let i=0; i < array.length; otherIndex++) {\n' +
          '  const item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-each'}
        ]);
      });

      it('when comparing a different index', () => {
        expectNoChange(
          'for (let i=0; otherIndex < array.length; i++) {\n' +
          '  const item = array[i];\n' +
          '  console.log(item);\n' +
          '}'
        ).withWarnings([
          {line: 1, msg: 'Unable to transform for loop', type: 'for-each'}
        ]);
      });
    });

    describe('comments', () => {
      it('should preserve for-loop comments', () => {
        expectTransform(
          '// Some comments\n' +
          'for (let i=0; i < array.length; i++) {\n' +
          '  const item = array[i];\n' +
          '  console.log(item.i);\n' +
          '}'
        ).toReturn(
          '// Some comments\n' +
          'array.forEach(item => {\n' +
          '  console.log(item.i);\n' +
          '});'
        );
      });

      it('should preserve loop variable comments', () => {
        expectTransform(
          'for (let i=0; i < array.length; i++) {\n' +
          '  // Some comments\n' +
          '  const item = array[i];\n' +
          '  console.log(item.i);\n' +
          '}'
        ).toReturn(
          '// Some comments\n' +
          'array.forEach(item => {\n' +
          '  console.log(item.i);\n' +
          '});'
        );
      });
    });
  });
});
