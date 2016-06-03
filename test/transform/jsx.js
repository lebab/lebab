import {expect} from 'chai';
import Transformer from './../../lib/transformer';
const transformer = new Transformer({
  'class': true,
  'template': true,
  'arrow': true,
  'let': true,
  'default-param': true,
  'arg-spread': true,
  'obj-method': true,
  'obj-shorthand': true,
  'no-strict': true,
  'commonjs': true,
});

function expectNoChange(script) {
  expect(transformer.run(script)).to.equal(script);
}

describe('JSX support', () => {
  it.only('ignores JSX syntax', () => {
    expectNoChange(
      'var foo = ( <div/> );'
    );
  });
});
