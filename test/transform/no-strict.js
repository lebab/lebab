import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'no-strict': true});

function test(script) {
  return transformer.run(script);
}

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
    expect(test('x = "use strict";')).to.equal('x = "use strict";');
    expect(test('foo("use strict");')).to.equal('foo("use strict");');
  });
});
