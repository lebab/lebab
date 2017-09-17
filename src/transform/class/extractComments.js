import {flatMap} from 'lodash/fp';
/**
 * Extracts comments from an array of nodes.
 * @param {Object[]} nodes
 * @param {Object[]} extracted comments
 */
export default function extractComments(nodes) {
  return flatMap(n => n.comments || [], nodes);
}
