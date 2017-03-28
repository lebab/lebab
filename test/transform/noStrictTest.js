import createTestHelpers from '../createTestHelpers';
const {expectTransform, expectNoChange} = createTestHelpers(['no-strict']);

describe('Removal of "use strict"', () => {
  it('should remove statement with "use strict" string', () => {
    expectTransform('"use strict";').toReturn('');
    expectTransform('\'use strict\';').toReturn('');
  });

  it('should remove the whole line where "use strict" used to be', () => {
    expectTransform('"use strict";\nfoo();').toReturn('foo();');
    expectTransform('foo();\n"use strict";\nbar();').toReturn('foo();\nbar();');
  });

  it('should not remove comments before "use strict"', () => {
    expectTransform('// foo();\n"use strict";\nbar();').toReturn('// foo();\nbar();');
  });

  it('should keep "use strict" used inside other code', () => {
    expectNoChange('x = "use strict";');
    expectNoChange('foo("use strict");');
  });
});
