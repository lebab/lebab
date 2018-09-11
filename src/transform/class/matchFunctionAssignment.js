import {matches, extract, extractAny} from 'f-matches';

/**
 * Matches: <className>.<methodName> = function () { ... }
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - methodName
 * - methodNode
 *
 * @param  {Object} node
 * @return {Object}
 */
export default matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: extractAny('className')
      },
      property: {
        type: 'Identifier',
        name: extractAny('methodName')
      }
    },
    operator: '=',
    right: extract('methodNode', {
      type: 'FunctionExpression'
    })
  }
});
