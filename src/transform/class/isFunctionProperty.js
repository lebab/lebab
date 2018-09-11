import {matches} from 'f-matches';
import isTransformableToMethod from './isTransformableToMethod';

/**
 * Matches: <ident>: function() { ... }
 *
 * @param {Object} node
 * @return {Boolean}
 */
export default matches({
  type: 'Property',
  key: {
    type: 'Identifier',
    // name: <ident>
  },
  computed: false,
  value: isTransformableToMethod,
});
