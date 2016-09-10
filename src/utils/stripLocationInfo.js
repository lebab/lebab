/**
 * Returns a copied version of the node recieved without location attributes.
 * @param  {Object}  node
 * @return {Object}  node
 */
export default function stripLocationInfo(node) {
  if (typeof node === 'object') {
    node = Object.assign({}, node);
    delete node.start;
    delete node.end;
    delete node.loc;
    for (var key in node) {
      if (node.hasOwnProperty(key)) {
        node[key] = stripLocationInfo(node[key]);
      }
    }
  }
  return node;
}
