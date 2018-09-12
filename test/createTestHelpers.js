import {expect} from 'chai';
import createTransformer from './../src/createTransformer';

/**
 * Generates functions that are used in all transform-tests.
 * @param  {String[]} transformNames Config for Transformer class
 * @return {Object} functions expectTransform() and expectNoChange()
 */
export default function(transformNames) {
  const transformer = createTransformer(transformNames);

  // Generic transformation asserter, to be called like:
  //
  //   expectTransform("code")
  //     .toReturn("transformed code");
  //     .withWarnings(["My warning"]);
  //
  function expectTransform(script) {
    const {code, warnings} = transformer.run(script);

    return {
      toReturn(expectedValue) {
        expect(code).to.equal(expectedValue);
        return this;
      },
      withWarnings(expectedWarnings) {
        expect(warnings).to.deep.equal(expectedWarnings);
        return this;
      },
      withoutWarnings() {
        return this.withWarnings([]);
      },
    };
  }

  // Asserts that transforming the string has no effect,
  // and also allows to check for warnings like so:
  //
  //   expectNoChange("code")
  //     .withWarnings(["My warning"]);
  //
  function expectNoChange(script) {
    return expectTransform(script).toReturn(script);
  }

  return {expectTransform, expectNoChange};
}
