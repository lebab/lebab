import {expect} from 'chai';
import Transformer from './../lib/transformer';

/**
 * Generates functions that are used in all transform-tests.
 * @param  {Object} transformsCfg Config for Transformer class
 * @return {Object} functions expect(), test() and expectNoChange()
 */
export default function(transformsCfg) {
  const transformer = new Transformer(transformsCfg);

  return {
    // Pass-through assertion from Chai
    expect,

    // Transforms the given string
    test(script) {
      return transformer.run(script);
    },

    // Asserts that transfroming the string has no effect
    expectNoChange(script) {
      expect(transformer.run(script)).to.equal(script);
    }
  };
}
