import estraverse from 'estraverse';
import typeChecker from '../../utils/type-checker';
import matchesAst from '../../utils/matches-ast';
import multiReplaceStatement from '../../utils/multi-replace-statement';
import ImportDeclaration from '../../syntax/import-declaration';
import ImportSpecifier from '../../syntax/import-specifier';
import ImportDefaultSpecifier from '../../syntax/import-default-specifier';
import VariableDeclaration from '../../syntax/variable-declaration';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node, parent) {
      if (isVarWithRequireCalls(node) && parent.type === 'Program') {
        multiReplaceStatement(
          parent,
          node,
          node.declarations.map(dec => varToImport(dec, node.kind))
        );
      }
    }
  });
}

// Converts VariableDeclarator to ImportDeclaration when we recognize it
// as such, otherwise converts it to full VariableDeclaration (of original kind).
function varToImport(dec, kind) {
  if (isDefaultRequire(dec)) {
    return new ImportDeclaration({
      specifier: new ImportDefaultSpecifier(dec.id),
      source: dec.init.arguments[0],
    });
  }
  else if (isNamedRequire(dec)) {
    return new ImportDeclaration({
      specifier: new ImportSpecifier({local: dec.id, imported: dec.init.property}),
      source: dec.init.object.arguments[0],
    });
  }
  else {
    return new VariableDeclaration(kind, [dec]);
  }
}

function isVarWithRequireCalls(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.some(dec => isDefaultRequire(dec) || isNamedRequire(dec));
}

// matches: require(<string>)
var isRequireCall = matchesAst({
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'require'
  },
  arguments: (args) => args.length === 1 && typeChecker.isString(args[0])
});

// Matches: <ident> = require(<string>);
var isDefaultRequire = matchesAst({
  type: 'VariableDeclarator',
  id: {
    type: 'Identifier',
    // name: <ident>
  },
  init: isRequireCall
});

// Matches: <ident> = require(<string>).<ident>;
var isNamedRequire = matchesAst({
  type: 'VariableDeclarator',
  id: {
    type: 'Identifier',
    // name: <ident>
  },
  init: {
    type: 'MemberExpression',
    computed: false,
    object: isRequireCall,
    property: {
      type: 'Identifier',
      // name: <ident>
    }
  }
});
