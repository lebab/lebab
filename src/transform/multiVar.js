import traverser from '../traverser';
import multiReplaceStatement from '../utils/multiReplaceStatement';
import VariableDeclaration from '../syntax/VariableDeclaration';

export default function(ast, logger) {
  traverser.traverse(ast, {
    enter(node, parent) {
      if (node.type === 'VariableDeclaration' && node.declarations.length > 1) {
        splitDeclaration(node, parent, logger);

        return traverser.VisitorOption.Skip;
      }
    }
  });
}

function splitDeclaration(node, parent, logger) {
  const declNodes = node.declarations.map(declarator => {
    return new VariableDeclaration(node.kind, [declarator]);
  });

  try {
    multiReplaceStatement({
      parent,
      node,
      replacements: declNodes,
      preserveComments: true,
    });
  }
  catch (e) {
    logger.warn(parent, `Unable to split var statement in a ${parent.type}`, 'multi-var');
  }
}
