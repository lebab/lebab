/**
 * Matches: function <className>() { ... }
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - constructorNode
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function(node) {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return {
      className: node.id.name,
      constructorNode: node
    };
  }
}
