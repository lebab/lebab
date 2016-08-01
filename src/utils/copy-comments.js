/**
 * Appends comments of one node to comments of another.
 *
 * - Modifies `to` node with added comments.
 * - Does nothing when there are no comments to copy
 *   (ensuring we don't modify the `to` node when not needed).
 *
 * @param  {Object} from Node to copy comments from
 * @param  {Object} to Node to copy comments to
 */
export default function copyComments({from, to}) {
  if (from.comments && from.comments.length > 0) {
    to.comments = (to.comments || []).concat(from.comments || []);
  }
}
