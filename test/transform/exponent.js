import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({'exponent': true});

function test(script) {
  return transformer.run(script);
}

function expectNoChange(script) {
  expect(test(script)).to.equal(script);
}

describe('Exponentiation operator', () => {
  it('should convert Math.pow()', () => {
    expect(test(
      'result = Math.pow(a, b);'
    )).to.equal(
      'result = a ** b;'
    );
  });

  it('should parenthesize arguments when needed', () => {
    expect(test(
      'result = Math.pow(a + 1, b + 2);'
    )).to.equal(
      'result = (a + 1) ** (b + 2);'
    );
  });

  it('should not convert Math.pow() without exactly two arguments', () => {
    expectNoChange('Math.pow();');
    expectNoChange('Math.pow(1);');
    expectNoChange('Math.pow(1, 2, 3);');
  });
});
