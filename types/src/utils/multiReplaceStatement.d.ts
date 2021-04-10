/**
 * Replaces `node` inside `parent` with any number of `replacements`.
 *
 * ESTraverse only allows replacing one node with a single other node.
 * This function overcomes this limitation, allowing to replace it with multiple nodes.
 *
 * NOTE: Only works for nodes that allow multiple elements in their body.
 *       When node doesn't exist inside parent, does nothing.
 *
 * @param  {Object} cfg
 *   @param  {Object} cfg.parent Parent node of the node to replace
 *   @param  {Object} cfg.node The node to replace
 *   @param  {Object[]} cfg.replacements Replacement nodes (can be empty array)
 *   @param  {Boolean} [cfg.preserveComments] True to copy over comments from
 *     node to first replacement node
 */
export default function multiReplaceStatement({ parent, node, replacements, preserveComments }: {
    parent: any;
    node: any;
    replacements: any[];
    preserveComments?: boolean;
}): void;
