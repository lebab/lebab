import {matchesAst, extract} from '../../utils/matches-ast';
import isModuleExports from './is-module-exports';

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
export default matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: isModuleExports,
    right: extract('value')
  },
});
