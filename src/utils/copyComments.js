/**
 * Appends (or prepends if specified) comments of one node to comments of another.
 *
 * - Modifies `to` node with added comments.
 * - Does nothing when there are no comments to copy
 *   (ensuring we don't modify the `to` node when not needed).
 *
 * @param  {Object} from Node to copy comments from
 * @param  {Object} to Node to copy comments to
 * @param  {Boolean} prepend prepend comments instead of appending
 */
export default function copyComments({from, to, prepend}) {
  if (from.comments && from.comments.length > 0) {
    const toComments = to.comments || [];
    const bothComments = prepend ? [from.comments, toComments] : [toComments, from.comments];
    to.comments = [].concat(...bothComments);
  }
}
