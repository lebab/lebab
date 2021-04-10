/**
 * Matches: <name> = <name> === undefined ? <value> : <name>;
 * Matches: <name> = typeof <name> === 'undefined' ? <value> : <name>;
 *
 * When node matches returns the extracted fields:
 *
 * - name
 * - value
 * - node (the entire node)
 *
 * @param {Object} node
 * @return {Object}
 */
export default function _default(node: any): any;
