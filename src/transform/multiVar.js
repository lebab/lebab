import traverser from '../traverser';
import multiReplaceStatement from '../utils/multiReplaceStatement';
import VariableDeclaration from '../syntax/VariableDeclaration';

export default function(ast) {
  traverser.traverse(ast, {
    enter(node, parent) {
      if (node.type === 'VariableDeclaration' && node.declarations.length > 1) {
        splitDeclaration(node, parent);

        return traverser.VisitorOption.Skip;
      }
    }
  });
}

function splitDeclaration(node, parent) {
  const declNodes = node.declarations.map(declarator => {
    return new VariableDeclaration(node.kind, [declarator]);
  });

  multiReplaceStatement({
    parent,
    node,
    replacements: declNodes,
    preserveComments: true,
  });
}
