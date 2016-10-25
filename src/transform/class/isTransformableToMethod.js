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
  return traverser.find(ast, 'ThisExpression', {
    skipTypes: ['FunctionExpression', 'FunctionDeclaration']
  });
}
