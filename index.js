var builtinTransforms = require('./lib/builtinTransforms');

/**
 * Exposes API similar to Babel:
 *
 *     import lebab from "lebab";
 *     const {code, warnings} = lebab.transform('Some JS', ['let', 'arrow']);
 *
 * @param  {String} code The code to transform
 * @param  {String[]} transformNames The transforms to apply
 * @return {Object} An object with code and warnings props
 */
exports.transform = function(code, transformNames) {
  return builtinTransforms.createTransformer(transformNames).run(code);
};
