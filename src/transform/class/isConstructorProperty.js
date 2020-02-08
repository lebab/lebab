import {matches} from 'f-matches';

/**
 * Matches: construtor: Class
 *
 * @param {Object} node
 * @return {Boolean}
 */
export default matches({
  type: 'Property',
  key: {
    type: 'Identifier',
    name: 'constructor'
  },
  computed: false,
  value: {
    type: 'Identifier'
  },
});
