import estraverse from 'estraverse';
import typeChecker from '../../utils/type-checker';
import {matchesAst, extract} from '../../utils/matches-ast';
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
  let m;
  if ((m = matchDefaultRequire(dec))) {
    return new ImportDeclaration({
      specifier: new ImportDefaultSpecifier(m.local),
      source: m.sources[0],
    });
  }
  else if ((m = matchNamedRequire(dec))) {
    return new ImportDeclaration({
      specifier: new ImportSpecifier(m),
      source: m.sources[0],
    });
  }
  else {
    return new VariableDeclaration(kind, [dec]);
  }
}

function isVarWithRequireCalls(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.some(dec => matchDefaultRequire(dec) || matchNamedRequire(dec));
}

// matches: require(<source>)
var matchRequireCall = matchesAst({
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'require'
  },
  arguments: extract('sources', (args) => {
    return args.length === 1 && typeChecker.isString(args[0]);
  })
});

// Matches: <local> = require(<source>);
var matchDefaultRequire = matchesAst({
  type: 'VariableDeclarator',
  id: extract('local', {
    type: 'Identifier'
  }),
  init: matchRequireCall
});

// Matches: <local> = require(<source>).<imported>;
var matchNamedRequire = matchesAst({
  type: 'VariableDeclarator',
  id: extract('local', {
    type: 'Identifier'
  }),
  init: {
    type: 'MemberExpression',
    computed: false,
    object: matchRequireCall,
    property: extract('imported', {
      type: 'Identifier'
    })
  }
});
