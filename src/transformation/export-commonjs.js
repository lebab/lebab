import estraverse from 'estraverse';
import ExportDefaultDeclaration from '../syntax/export-default-declaration.js';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: traverse
    });
  }

function traverse(node) {
  if (isModuleExportsAssignment(node)) {
    return new ExportDefaultDeclaration(node.expression.right);
  }
}

function isModuleExportsAssignment(node) {
  return node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.operator === '=' &&
    isModuleExportsMemberExpression(node.expression.left);
}

function isModuleExportsMemberExpression(node) {
  return node.type === 'MemberExpression' &&
    node.computed === false &&
    isIdentifier(node.object, 'module') &&
    isIdentifier(node.property, 'exports');
}

function isIdentifier(node, name) {
  return node.type === 'Identifier' && node.name === name;
}
