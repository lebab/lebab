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
 */
export default function multiReplaceStatement(parentNode, node, replacementNodes) {
  const body = getBody(parentNode);
  const index = body.indexOf(node);
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
