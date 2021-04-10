/**
 * True when node is variable update expression (like x++).
 *
 * @param {Object} node
 * @return {Boolean}
 */
export function isUpdate(node: any): boolean;
/**
 * True when node is reference to a variable.
 *
 * That is it's an identifier, that's not used:
 *
 * - as function name in function declaration/expression,
 * - as parameter name in function declaration/expression,
 * - as declared variable name in variable declaration,
 * - as object property name in member expression.
 * - as object property name in object literal.
 *
 * @param {Object} node
 * @param {Object} parent Immediate parent node (to determine context)
 * @return {Boolean}
 */
export function isReference(node: any, parent: any): boolean;
