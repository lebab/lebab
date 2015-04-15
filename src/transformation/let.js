import estraverse from 'estraverse';

export default
  function (ast) {
    estraverse.traverse(ast, {
      enter: replaceVar
    });
  }

let declarations = {};

function replaceVar(node) {
  if (node.type === 'VariableDeclaration') {
    node.declarations.forEach(function(dec) {
      declarations[dec.id.name] = node;
      declarations[dec.id.name].kind = 'const';
    });
  }

  if (node.type === 'AssignmentExpression') {
    let left = node.left.name || node.left.property.name;

    if (declarations[left]) {
      declarations[left].kind = 'let';
    }
  }
}
