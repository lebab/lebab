import traverser from '../../traverser';
import isVarWithRequireCalls from './isVarWithRequireCalls';
import {matchRequire, matchRequireWithProperty} from './matchRequire';
import multiReplaceStatement from '../../utils/multiReplaceStatement';
import ImportDeclaration from '../../syntax/ImportDeclaration';
import ImportSpecifier from '../../syntax/ImportSpecifier';
import ImportDefaultSpecifier from '../../syntax/ImportDefaultSpecifier';
import VariableDeclaration from '../../syntax/VariableDeclaration';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (isVarWithRequireCalls(node)) {
        if (parent.type !== 'Program') {
          logger.warn(node, 'import can only be at root level', 'commonjs');
          return;
        }

        multiReplaceStatement({
          parent,
          node,
          replacements: node.declarations.map(dec => varToImport(dec, node.kind)),
          preserveComments: true,
        });
      }
    }
  });
}

// Converts VariableDeclarator to ImportDeclaration when we recognize it
// as such, otherwise converts it to full VariableDeclaration (of original kind).
function varToImport(dec, kind) {
  let m;
  if ((m = matchRequire(dec))) {
    if (m.id.type === 'ObjectPattern') {
      return patternToNamedImport(m);
    }
    else if (m.id.type === 'Identifier') {
      return identifierToDefaultImport(m);
    }
  }
  else if ((m = matchRequireWithProperty(dec))) {
    if (m.property.name === 'default') {
      return identifierToDefaultImport(m);
    }
    return propertyToNamedImport(m);
  }
  else {
    return new VariableDeclaration(kind, [dec]);
  }
}

function patternToNamedImport({id, sources}) {
  return new ImportDeclaration({
    specifiers: id.properties.map(({key, value}) => {
      return createImportSpecifier({
        local: value,
        imported: key
      });
    }),
    source: sources[0]
  });
}

function identifierToDefaultImport({id, sources}) {
  return new ImportDeclaration({
    specifiers: [new ImportDefaultSpecifier(id)],
    source: sources[0],
  });
}

function propertyToNamedImport({id, property, sources}) {
  return new ImportDeclaration({
    specifiers: [createImportSpecifier({local: id, imported: property})],
    source: sources[0],
  });
}

function createImportSpecifier({local, imported}) {
  if (imported.name === 'default') {
    return new ImportDefaultSpecifier(local);
  }
  return new ImportSpecifier({local, imported});
}
