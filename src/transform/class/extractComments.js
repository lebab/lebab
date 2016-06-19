import _ from 'lodash';
/**
 * Extracts comments from an array of nodes.
 * @param {Object[]} nodes
 * @param {Object[]} extracted comments
 */
export default function extractComments(nodes) {
  return _.flatten(nodes.map(n => n.comments || []));
}
