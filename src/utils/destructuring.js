import _ from 'lodash';

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
export function extractVariables(node) {
  if (node.type === 'Identifier') {
    return [node];
  }

  if (node.type === 'ArrayPattern') {
    return _(node.elements).map(extractVariables).flatten().value();
  }
  if (node.type === 'ObjectPattern') {
    return _(node.properties).map(extractVariables).flatten().value();
  }
  if (node.type === 'Property') {
    return extractVariables(node.value);
  }

  // Ignore stuff like MemberExpressions,
  // we only care about variables.
  return [];
}

/**
 * Like extractVariables(), but returns the names of variables
 * instead of Identifier objects.
 *
 * @param  {Object} node
 * @return {String[]} variable names
 */
export function extractVariableNames(node) {
  return extractVariables(node).map(v => v.name);
}
