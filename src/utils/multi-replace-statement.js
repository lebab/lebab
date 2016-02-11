/**
 * Replaces `node` inside `parentNode` with any number of `replacementNodes`.
 *
 * ESTraverse only allows replacing one node with a single other node.
 * This function overcomes this limitation, allowing to replace it with multiple nodes.
 *
 * NOTE: Only works for Statement nodes.
 *
 * @param  {Object} parentNode
 * @param  {Object} node
 * @param  {Object[]} replacementNodes
 */
export default
function multiReplaceStatement(parentNode, node, replacementNodes) {
  parentNode.body.splice(parentNode.body.indexOf(node), 1, ...replacementNodes);
}
