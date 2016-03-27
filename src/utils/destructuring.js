import _ from 'lodash';

/**
 * Extracts all variable names from from destructuring
 * operation in assignment or variable declaration.
 *
 * Also works for a single identifier (so it generalizes
 * for all assignments / variable declarations).
 *
 * @param  {Object} node
 * @return {String[]} Variable names
 */
export function extractVariableNames(node) {
  if (node.type === 'Identifier') {
    return [node.name];
  }

  if (node.type === 'ArrayPattern') {
    return _(node.elements).map(extractVariableNames).flatten().value();
  }
  if (node.type === 'ObjectPattern') {
    return _(node.properties).map(extractVariableNames).flatten().value();
  }
  if (node.type === 'Property') {
    return extractVariableNames(node.value);
  }

  // Ignore stuff like MemberExpressions,
  // we only care about variables.
  return [];
}
