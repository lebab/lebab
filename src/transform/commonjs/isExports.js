import {matches} from 'f-matches';

/**
 * Matches just identifier `exports`
 * @param  {Object} node
 * @return {Boolean}
 */
export default matches({
  type: 'Identifier',
  name: 'exports'
});
