import matchesAst from '../../utils/matchesAst';
import isExports from './isExports';

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
