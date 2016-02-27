function isFunctionVariableDeclaration(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.length === 1 &&
    node.declarations[0].init &&
    node.declarations[0].init.type === 'FunctionExpression';
}

/**
 * Matches: var <className> = function () { ... }
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - constructorNode
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function (node) {
  if (isFunctionVariableDeclaration(node)) {
    const {
      declarations: [
        {
          id: {name: className},
          init: constructorNode,
        }
      ]
    } = node;

    return {className, constructorNode};
  }
}
