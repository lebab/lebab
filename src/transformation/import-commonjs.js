import estraverse from 'estraverse';
import typeChecker from '../utils/type-checker.js';
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

    parent.body.splice(parent.body.indexOf(node), 1, ...declarations);
  }
}

function isVarWithRequireCalls(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.some(isRequireDeclaration);
}

function isRequireDeclaration(node) {
  return node.id.type === 'Identifier' &&
    node.init &&
    isRequireCall(node.init);
}

function isRequireCall(node) {
  return node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node.arguments.length === 1 &&
    typeChecker.isString(node.arguments[0]);
}
