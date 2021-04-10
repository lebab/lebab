/**
 * Checks that for-loop can be transformed to Array.forEach()
 *
 * Returns a warning message in case we can't transform.
 *
 * @param  {Object} node The ForStatement
 * @param  {Object} body BlockStatement that's body of ForStatement
 * @param  {String} indexKind
 * @param  {String} itemKind
 * @return {Array} Array of node and warnings message or undefined on success.
 */
export default function validateForLoop(node: any, { body, indexKind, itemKind }: any): any[];
