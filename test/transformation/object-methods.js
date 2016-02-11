var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  transformer = new Transformer({objectMethods: true});

function test(script) {
  transformer.read(script);
  transformer.applyTransformations();
  return transformer.out();
}

describe('Object methods', function () {

  it('should convert a function inside an object to method', function () {
    var script = 'var object = {\nsomeMethod: function() {\n}\n}';

    expect(test(script)).to.include('someMethod() {');
    expect(test(script)).to.not.include('someMethod: function() {');
  });

  it('should convert multiple functions inside an object to multiple methods', function () {
    var script = 'var object = {\nfirstMethod: function() {\n},\nsecondMethod: function() {\n}\n}';

    expect(test(script)).to.include('firstMethod() {');
    expect(test(script)).to.not.include('firstMethod: function() {');
    expect(test(script)).to.include('secondMethod() {');
    expect(test(script)).to.not.include('secondMethod: function() {');
  });

  it('should convert a function inside an object to a method beside other properties', function () {
    var script = 'var object = {\nsomeMethod: function() {\n},\nsomeString: \'\',\nsomeNumber: 1372\n}';

    expect(test(script)).to.include('someMethod() {');
    expect(test(script)).to.not.include('someMethod: function() {');
    expect(test(script)).to.include('someString: \'\'');
    expect(test(script)).to.include('someNumber: 1372');
  });

});
