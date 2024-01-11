const createTransformer = require('./lib/createTransformer').default;

/**
 * Exposes API similar to Babel:
 *
 *     import lebab from "lebab";
 *     const {code, warnings} = lebab.transform('Some JS', ['let', 'arrow']);
 *
 * @param  {String} code The code to transform
 * @param  {String[]} transformNames The transforms to apply
 * @param  {Object} options Options to configure the transforms
 * @return {Object} An object with code and warnings props
 */
exports.transform = function(code, transformNames, options) {
  return createTransformer(transformNames, options).run(code);
};
