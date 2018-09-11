import {matches, extractAny} from 'f-matches';
import isModuleExports from './isModuleExports';

/**
 * Matches: module.exports = <value>
 *
 * When match found, return object with:
 *
 * - value
 *
 * @param  {Object} node
 * @return {Object|Boolean}
 */
export default matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: isModuleExports,
    right: extractAny('value')
  },
});
