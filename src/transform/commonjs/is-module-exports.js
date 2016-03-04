import matchesAst from '../../utils/matches-ast';
import isExports from './is-exports';

/**
 * Matches: module.exports
 * @param  {Object} node
 * @return {Boolean}
 */
export default matchesAst({
  type: 'MemberExpression',
  computed: false,
  object: {
    type: 'Identifier',
    name: 'module'
  },
  property: isExports
});
