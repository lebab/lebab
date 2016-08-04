import {matchesAst, extract} from '../../utils/matches-ast';

/**
 * Matches: util.inherits(<className>,<otherClass>)
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - superClass
 *
 * @param  {Object} node
 * @return {Object}
 */
export default matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'util'
      },
      property: {
        type: 'Identifier',
        name: 'inherits'
      }
    },
    arguments: [
      {
        type: 'Identifier',
        name: extract('className')
      },
      extract('superClass')
    ]
  }
});
