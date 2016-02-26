import estraverse from 'estraverse';
import typeChecker from '../utils/type-checker.js';
import matchesAst from '../utils/matches-ast.js';
import multiReplaceStatement from '../utils/multi-replace-statement.js';
import ImportDeclaration from '../syntax/import-declaration.js';
import VariableDeclaration from '../syntax/variable-declaration.js';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: traverse
    });
  }

function traverse(node, parent) {
  if (isVarWithRequireCalls(node) && parent.type === 'Program') {
    const declarations = node.declarations.map(dec => {
      if (isRequireDeclaration(dec)) {
        return new ImportDeclaration(dec.id, dec.init.arguments[0]);
      } else {
        return new VariableDeclaration(node.kind, [dec]);
      }
    });

    multiReplaceStatement(parent, node, declarations);
  }
}

function isVarWithRequireCalls(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.some(isRequireDeclaration);
}

// Matches: <ident> = require(<string>);
var isRequireDeclaration = matchesAst({
  type: 'VariableDeclarator',
  id: {
    type: 'Identifier',
    // name: <ident>
  },
  init: {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'require'
    },
    arguments: (args) => args.length === 1 && typeChecker.isString(args[0])
  }
});
