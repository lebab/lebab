import estraverse from 'estraverse';
import isString from '../../utils/is-string';
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
  if ((m = matchRequire(dec))) {
    if (m.id.type === 'ObjectPattern') {
      return patternToNamedImport(m);
    }
    else if (m.id.type === 'Identifier') {
      return identifierToDefaultImport(m);
    }
  }
  else if ((m = matchRequireWithProperty(dec))) {
    return propertyToNamedImport(m);
  }
  else {
    return new VariableDeclaration(kind, [dec]);
  }
}

function patternToNamedImport({id, sources}) {
  return new ImportDeclaration({
    specifiers: id.properties.map(({key, value}) => {
      return new ImportSpecifier({
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
    specifiers: [new ImportSpecifier({local: id, imported: property})],
    source: sources[0],
  });
}

function isVarWithRequireCalls(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.some(dec => matchRequire(dec) || matchRequireWithProperty(dec));
}

var isIdentifier = matchesAst({
  type: 'Identifier'
});

// matches Property with Identifier key and value (possibly shorthand)
var isSimpleProperty = matchesAst({
  type: 'Property',
  key: isIdentifier,
  computed: false,
  value: isIdentifier
});

// matches: {a, b: myB, c, ...}
var isObjectPattern = matchesAst({
  type: 'ObjectPattern',
  properties: (props) => props.every(isSimpleProperty)
});

// matches: require(<source>)
var matchRequireCall = matchesAst({
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'require'
  },
  arguments: extract('sources', (args) => {
    return args.length === 1 && isString(args[0]);
  })
});

// Matches: <id> = require(<source>);
var matchRequire = matchesAst({
  type: 'VariableDeclarator',
  id: extract('id', id => isIdentifier(id) || isObjectPattern(id)),
  init: matchRequireCall
});

// Matches: <id> = require(<source>).<property>;
var matchRequireWithProperty = matchesAst({
  type: 'VariableDeclarator',
  id: extract('id', isIdentifier),
  init: {
    type: 'MemberExpression',
    computed: false,
    object: matchRequireCall,
    property: extract('property', {
      type: 'Identifier'
    })
  }
});
