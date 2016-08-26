import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['multi-var']);

describe('Multi-var', () => {
  describe('with only one variable per declaration', () => {
    it('should not change anything', () => {
      expectTransform(
        'var x;'
      ).toReturn(
        'var x;'
      );
    });
  });

  describe('with only uninitialized variables', () => {
    it('should split into separate declarations', () => {
      expectTransform(
        'var x,y;'
      ).toReturn(
        'var x;\n' +
        'var y;'
      );
    });
  });

  describe('with uninitialized and initialized variables', () => {
    it('should split into separate declarations', () => {
      expectTransform(
        'var x,y=100;'
      ).toReturn(
        'var x;\n' +
        'var y=100;'
      );
    });
  });

  describe('with various type of declarations', () => {
    it('should split into separate declarations', () => {
      expectTransform(
        'var x,y=100;\n' +
        'let a,b=123;\n' +
        'const c=12,d=234'
      ).toReturn(
        'var x;\n' +
        'var y=100;\n' +
        'let a;\n' +
        'let b=123;\n' +
        'const c=12;\n' +
        'const d=234;'
      );
    });
  });

  describe('with inline comment', () => {
    it('should split into separate declarations', () => {
      expectTransform(
        'var x,y=100;// hello'
      ).toReturn(
        'var x;// hello\n' +
        'var y=100;'
      );
    });
  });

  describe('with block comment', () => {
    it('should split into separate declarations(comment before declaration)', () => {
      expectTransform(
        '/* hello */var x,y=100;'
      ).toReturn(
        '/* hello */var x;\n' +
        'var y=100;'
      );
    });

    it('should split into separate declarations(comment after declaration)', () => {
      expectTransform(
        'var x,y=100;/* hello */'
      ).toReturn(
        'var x;/* hello */\n' +
        'var y=100;'
      );
    });

    it('should split into separate declarations(comment inside declaration)', () => {
      expectTransform(
        'var x,/* hello */y=100;'
      ).toReturn(
        'var x;\n' +
        'var /* hello */y=100;'
      );
    });
  });

  describe('inside case statement', () => {
    it('should split into separate declarations', () => {
      expectTransform(
        'switch (nr) {\n' +
        '  case 1:\n' +
        '    var a=1, b=2;\n' +
        '}'
      ).toReturn(
        'switch (nr) {\n' +
        '  case 1:\n' +
        '    var a=1;\n' +
        '    var b=2;\n' +
        '}'
      );
    });
  });

  describe('when var can not be split', () => {
    it('should not split in for-loop head', () => {
      expectNoChange(
        'for (var i=0,j=0; i<j; i++) j++;'
      ).withWarnings([
        {line: 1, msg: 'Unable to split var statement in a ForStatement', type: 'multi-var'}
      ]);
    });

    it('should not split when not in block statement', () => {
      expectNoChange(
        'if (true) var a=1, b=2;'
      ).withWarnings([
        {line: 1, msg: 'Unable to split var statement in a IfStatement', type: 'multi-var'}
      ]);
    });
  });
});
