import traverser from '../traverser';
import multiReplaceStatement from '../utils/multi-replace-statement';
import VariableDeclaration from '../syntax/variable-declaration';

export default function(ast) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (node.type === 'VariableDeclaration' && node.declarations.length > 1) {
        this.skip();

        splitDeclarations(parent, node);
      }
    }
  });
}

function splitDeclarations(parent, node) {
  const declNodes = node.declarations.map(declarator => {
    return new VariableDeclaration(node.kind, [declarator]);
  });

  multiReplaceStatement({
    parent: parent,
    node: node,
    replacements: declNodes,
    preserveComments: true,
  });
}
