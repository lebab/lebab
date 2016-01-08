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

  if (node.type === 'AssignmentExpression' && node.left.type === 'Identifier') {
    let left = node.left.name;

    if (declarations[left]) {
      declarations[left].kind = 'let';
    }
  } else if (node.type === 'UpdateExpression' && node.argument.type === 'Identifier') {
    let name = node.argument.name;
    if (declarations[name]) {
      declarations[name].kind = 'let';
    }
  }
}
