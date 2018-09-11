import {matches, extract, extractAny} from 'f-matches';
import isExports from './isExports';
import isModuleExports from './isModuleExports';

/**
 * Matches: exports.<id> = <value>
 * Matches: module.exports.<id> = <value>
 *
 * When match found, returns object with:
 *
 * - id
 * - value
 *
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
export default matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: (ast) => isExports(ast) || isModuleExports(ast),
      property: extract('id', {
        type: 'Identifier'
      })
    },
    right: extractAny('value')
  }
});
