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
    // Generic transformation asserter, to be called like:
    //
    //   expectTransform("code").toReturn("transformed code");
    //
    expectTransform(script) {
      const code = transformer.run(script).code;

      return {
        toReturn(expectedValue) {
          expect(code).to.equal(expectedValue);
        }
      };
    },

    // Asserts that transfroming the string has no effect
    expectNoChange(script) {
      expect(transformer.run(script).code).to.equal(script);
    }
  };
}
