import matchesAst from '../../utils/matchesAst';

/**
 * Matches just identifier `exports`
 * @param  {Object} node
 * @return {Boolean}
 */
export default matchesAst({
  type: 'Identifier',
  name: 'exports'
});
