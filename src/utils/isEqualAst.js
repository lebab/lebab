import {isEqualWith} from 'lodash/fp';

const metaDataFields = {
  comments: true,
  loc: true,
  start: true,
  end: true,
};

/**
 * True when two AST nodes are structurally equal.
 * When comparing objects it ignores the meta-data fields for
 * comments and source-code position.
 * @param  {Object}  a
 * @param  {Object}  b
 * @return {Boolean}
 */
export default function isEqualAst(a, b) {
  return isEqualWith((aValue, bValue, key) => metaDataFields[key], a, b);
}
