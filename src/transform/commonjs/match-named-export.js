import {matchesAst, extract} from '../../utils/matches-ast';
import isExports from './is-exports';
import isModuleExports from './is-module-exports';

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
export default matchesAst({
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
    right: extract('value')
  }
});
