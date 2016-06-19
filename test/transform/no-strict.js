import createTestHelpers from '../createTestHelpers';
const {expect, test, expectNoChange} = createTestHelpers({'no-strict': true});

describe('Removal of "use strict"', () => {
  it('should remove statement with "use strict" string', () => {
    expect(test('"use strict";')).to.equal('');
    expect(test('\'use strict\';')).to.equal('');
  });

  it('should remove the whole line where "use strict" used to be', () => {
    expect(test('"use strict";\nfoo();')).to.equal('foo();');
    expect(test('foo();\n"use strict";\nbar();')).to.equal('foo();\nbar();');
  });

  it('should keep "use strict" used inside other code', () => {
    expectNoChange('x = "use strict";');
    expectNoChange('foo("use strict");');
  });
});
