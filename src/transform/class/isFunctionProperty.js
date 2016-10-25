import matchesAst from '../../utils/matchesAst';
import isTransformableToMethod from './isTransformableToMethod';

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
  value: isTransformableToMethod,
});
