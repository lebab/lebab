var expect = require('chai').expect;
var Transformer = require('./../../lib/transformer');
var transformer = new Transformer({commonjs: true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Export CommonJS', () => {

  it('should convert module.exports assignment to default export', () => {
    expect(test('module.exports = 123;')).to.equal('export default 123;');
    expect(test('module.exports = function() {};')).to.equal('export default function() {};');
    expect(test('module.exports = x => x;')).to.equal('export default x => x;');
    expect(test('module.exports = class {};')).to.equal('export default class {};');
  });

  it('should not convert assignment to exports', () => {
    expectNoChange('exports = function() {};');
  });

  it('should not convert weird assignment to module.exports', () => {
    expectNoChange('module.exports += function() {};');
    expectNoChange('module.exports -= function() {};');
    expectNoChange('module.exports *= function() {};');
    expectNoChange('module.exports /= function() {};');
  });

  // A pretty weird thing to do...
  // shouldn't bother supporting it.
  it('should not convert assignment to module["exports"]', () => {
    expectNoChange('module["exports"] = function() {};');
  });

  it('should ignore module.exports inside statements', () => {
    expectNoChange(
      'if (true) {\n' +
      '  module.exports = function() {};\n' +
      '}'
    );
  });

});
