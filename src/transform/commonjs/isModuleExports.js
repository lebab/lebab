import {matches} from 'f-matches';
import isExports from './isExports';

/**
 * Matches: module.exports
 * @param  {Object} node
 * @return {Boolean}
 */
export default matches({
  type: 'MemberExpression',
  computed: false,
  object: {
    type: 'Identifier',
    name: 'module'
  },
  property: isExports
});
