import traverser from '../../traverser';

/**
 * Detects if function can be transformed to class method
 * @param  {Object}  node
 * @return {Boolean}
 */
export default function isTransformableToMethod(node) {
  if (node.type === 'FunctionExpression') {
    return true;
  }
  if (node.type === 'ArrowFunctionExpression' && !usesThis(node)) {
    return true;
  }
}

function usesThis(ast) {
  let found = false;
  traverser.traverse(ast, {
    enter(node) {
      if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
        return traverser.VisitorOption.Skip;
      }
      if (node.type === 'ThisExpression') {
        found = true;
        return traverser.VisitorOption.Break;
      }
    }
  });
  return found;
}
