import estraverse from 'estraverse';
import matchesAst from '../../utils/matches-ast';
import ExportDefaultDeclaration from '../../syntax/export-default-declaration';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: traverse
    });
  }

function traverse(node, parent) {
  if (isModuleExportsAssignment(node) && parent.type === 'Program') {
    return new ExportDefaultDeclaration(node.expression.right);
  }
}

// Matches: module.exports = ...
var isModuleExportsAssignment = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'module'
      },
      property: {
        type: 'Identifier',
        name: 'exports'
      }
    }
  }
});
