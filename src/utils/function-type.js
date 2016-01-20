/**
 * True when node is any kind of function.
 */
export function isFunction(node) {
  return isFunctionDeclaration(node) || isFunctionExpression(node);
}

/**
 * True when node is (arrow) function expression.
 */
export function isFunctionExpression(node) {
  return node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
}

/**
 * True when node is function declaration.
 */
export function isFunctionDeclaration(node) {
  return node.type === 'FunctionDeclaration';
}
