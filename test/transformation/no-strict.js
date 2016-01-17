var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var noStrictTransformation = require('./../../lib/transformation/no-strict');

var transformer = new Transformer({});

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(noStrictTransformation);
  return transformer.out();
}

describe('Removal of "use strict"', function () {

  it('should remove statement with "use strict" string', function () {
    expect(test('"use strict";')).to.equal('');
    expect(test("'use strict';")).to.equal('');
  });

  it('should remove the whole line where "use strict" used to be', function () {
    expect(test('"use strict";\nfoo();')).to.equal('foo();');
    expect(test('foo();\n"use strict";\nbar();')).to.equal('foo();\nbar();');
  });

  it('should keep "use strict" used inside other code', function () {
    expect(test('x = "use strict";')).to.equal('x = "use strict";');
    expect(test('foo("use strict");')).to.equal('foo("use strict");');
  });

});
