/**
 * True when the given node is string literal.
 * @param  {Object}  node
 * @return {Boolean}
 */
export default function isString(node) {
  return node.type === 'Literal' && typeof node.value === 'string';
}
