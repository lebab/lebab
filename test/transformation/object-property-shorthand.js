var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  objectPropertyShorthandTransformation = require('./../../lib/transformation/object-property-shorthand'),
  transformer = new Transformer({formatter: false});

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(objectPropertyShorthandTransformation);
  return transformer.out();
}

describe('Object property Shorthand', function () {

  it('should convert a property inside an object with same key and value to its shorthand', function () {
    var script = 'var object = {\na: a\n}';

    expect(test(script)).to.include('a');
    expect(test(script)).to.equal('var object = {\na\n}');
  });

  it('should convert multiple property inside an object with same key and value to its shorthand', function () {
    var script = 'var object = {\nfirstProp: firstProp,\nsecondProp: secondProp\n}';

    expect(test(script)).to.include('firstProp');
    expect(test(script)).to.not.include('firstProp: ');
    expect(test(script)).to.include('secondProp');
    expect(test(script)).to.not.include('secondProp: ');
    expect(test(script)).to.equal('var object = {\nfirstProp,\nsecondProp\n}');
  });

  it('should convert a multiple property inside an object with the same key and value to its shorthand beside other properties', function () {
    var script = 'var object = {\nfirstProp: firstProp,\nsecondProp: secondProp,\nsomeString: \'\',\nsomeNumber: 1372\n}';

    expect(test(script)).to.include('firstProp');
    expect(test(script)).to.not.include('firstProp: ');
    expect(test(script)).to.include('secondProp');
    expect(test(script)).to.not.include('secondProp: ');
    expect(test(script)).to.include('someString: \'\'');
    expect(test(script)).to.include('someNumber: 1372');
    expect(test(script)).to.equal('var object = {\nfirstProp,\nsecondProp,\nsomeString: \'\',\nsomeNumber: 1372\n}');
  });

});