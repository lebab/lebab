/**
 * Extracts all variables from from destructuring
 * operation in assignment or variable declaration.
 *
 * Also works for a single identifier (so it generalizes
 * for all assignments / variable declarations).
 *
 * @param  {Object} node
 * @return {Object[]} Identifiers
 */
export function extractVariables(node: any): any[];
/**
 * Like extractVariables(), but returns the names of variables
 * instead of Identifier objects.
 *
 * @param  {Object} node
 * @return {String[]} variable names
 */
export function extractVariableNames(node: any): string[];
