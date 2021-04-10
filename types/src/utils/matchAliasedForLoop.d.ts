/**
 * Matches for-loop that aliases current array element
 * in the first line of the loop body:
 *
 *     for (let index = 0; index < array.length; index++) {
 *         let item = array[index];
 *         ...
 *     }
 *
 * Extracts the following fields:
 *
 * - index - loop index identifier
 * - indexKind - the kind of <index>
 * - array - array identifier or expression
 * - item - identifier used to alias current array element
 * - itemKind - the kind of <item>
 * - body - the whole BlockStatement of for-loop body
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function _default(ast: any): any;
