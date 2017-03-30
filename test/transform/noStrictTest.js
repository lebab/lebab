import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['no-strict']);

describe('Removal of "use strict"', () => {
  it('should remove statement with "use strict" string', () => {
    expectTransform('"use strict";').toReturn('');
    expectTransform('\'use strict\';').toReturn('');
  });

  it('should remove the whole line where "use strict" used to be', () => {
    expectTransform(
      '"use strict";\n' +
      'foo();'
    ).toReturn(
      'foo();'
    );

    expectTransform(
      'foo();\n' +
      '"use strict";\n' +
      'bar();'
    ).toReturn(
      'foo();\n' +
      'bar();'
    );
  });

  it('should not remove comments before "use strict"', () => {
    expectTransform(
      '// comment\n' +
      '"use strict";\n' +
      'bar();'
    ).toReturn(
      '// comment\n' +
      'bar();'
    );
  });

  it('should preserve comments when no other code besides "use strict"', () => {
    expectTransform(
      '// some comment\n' +
      '"use strict";'
    ).toReturn(
      '// some comment\n'
    );
  });

  it('should keep "use strict" used inside other code', () => {
    expectNoChange('x = "use strict";');
    expectNoChange('foo("use strict");');
  });
});
