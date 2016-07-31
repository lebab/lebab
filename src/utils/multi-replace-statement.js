/**
 * Replaces `node` inside `parentNode` with any number of `replacementNodes`.
 *
 * ESTraverse only allows replacing one node with a single other node.
 * This function overcomes this limitation, allowing to replace it with multiple nodes.
 *
 * NOTE: Only works for nodes that allow multiple elements in their body.
 *       When node doesn't exist inside parentNode, does nothing.
 *
 * @param  {Object} parentNode
 * @param  {Object} node
 * @param  {Object[]} replacementNodes
 * @param  {Object} [flags]
 *   @param  {Boolean} [flags.preserveComments] True to copy over comments from
 *     node to first replacement node
 */
export default function multiReplaceStatement(parentNode, node, replacementNodes, {preserveComments} = {}) {
  const body = getBody(parentNode);
  const index = body.indexOf(node);
  if (preserveComments) {
    copyComments(node, replacementNodes[0]);
  }
  if (index !== -1) {
    body.splice(index, 1, ...replacementNodes);
  }
}

function getBody(node) {
  switch (node.type) {
  case 'BlockStatement':
  case 'Program':
    return node.body;
  case 'SwitchCase':
    return node.consequent;
  default:
    throw `Unsupported node type '${node.type}' in multiReplaceStatement()`;
  }
}

function copyComments(node, replacementNode) {
  if (node.comments && node.comments.length > 0 && replacementNode) {
    const existingComments = replacementNode.comments || [];
    replacementNode.comments = existingComments.concat(node.comments);
  }
}
