import {expect} from 'chai';

export function testTransformApi(transform) {
  it('performs successful transform', () => {
    const {code, warnings} = transform(
      'var f = function(a) { return a; };',
      ['let', 'arrow', 'arrow-return']
    );
    expect(code).to.equal('const f = a => a;');
    expect(warnings).to.deep.equal([]);
  });

  it('outputs warnings', () => {
    const input = 'if (true) { var x = 10; }\n x = 12;\n';

    const {code, warnings} = transform(input, ['let']);
    expect(code).to.equal(input);
    expect(warnings).to.deep.equal([
      {line: 1, msg: 'Unable to transform var', type: 'let'},
    ]);
  });

  it('throws for invalid transform type', () => {
    expect(() => {
      transform('', ['blah']);
    }).to.throw('Unknown transform "blah".');
  });

  it('throws for syntax error in input code', () => {
    expect(() => {
      transform('@!class', ['let']);
    }).to.throw('Unexpected character \'@\'');
  });
}
