import matchesAst from '../../utils/matches-ast';

/**
 * Matches just identifier `exports`
 * @param  {Object} node
 * @return {Boolean}
 */
export default matchesAst({
  type: 'Identifier',
  name: 'exports'
});
