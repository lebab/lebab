import {matchesAst, extract} from '../../utils/matches-ast';
import {isFunctionExpression} from '../../utils/function-type';
import isExports from './is-exports';
import isModuleExports from './is-module-exports';

const testNamedFunctionExport = matchesAst({
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
    right: extract('func', isFunctionExpression)
  }
});

/**
 * Matches: exports.<id> = <func>
 * Matches: module.exports.<id> = <func>
 *
 * When match found, returns object with:
 *
 * - id
 * - func
 *
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
export default function(node) {
  const {id, func} = testNamedFunctionExport(node);

  // Exclude functions with different name than the assigned property name
  if (id && (!func.id || func.id.name === id.name)) {
    return {id, func};
  }
}
