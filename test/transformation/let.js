var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  letTransformation = require('./../../lib/transformation/let'),
  transformer = new Transformer();

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(letTransformation);
  return transformer.out();
}

describe('Variable declaration var to let/const', function () {

  it('should use const for consistent variables', function () {
    var script = 'var test = 2;';

    expect(test(script)).to.equal('const test = 2;');
  });

  it('should use let for re-assigned variables', function () {
    var script = 'var test = 5; test = 6;';

    expect(test(script)).to.equal('let test = 5;\ntest = 6;');
  });

  it('should work for multiple declarations', function() {
    var script = 'var x = 2, y = 3; x = 5';

    expect(test(script)).to.equal('let x = 2, y = 3;\nx = 5;');
  });

  // Issue 31
  it('should not throw error for variables without var keyword', function () {
    var script = 'x = 2; this.y = 5';
    expect(test(script)).to.equal('x = 2;\nthis.y = 5;');
  });

  it('should use let for updated variables', function () {
    var script = 'var i = 0; i++;'
    expect(test(script)).to.equal('let i = 0;\ni++;');
  });
});
