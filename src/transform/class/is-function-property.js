import matchesAst from '../../utils/matches-ast';

/**
 * Matches: <ident>: function() { ... }
 *
 * @param {Object} node
 * @return {Boolean}
 */
export default matchesAst({
  type: 'Property',
  key: {
    type: 'Identifier',
    // name: <ident>
  },
  computed: false,
  value: {
    type: 'FunctionExpression'
  }
});
