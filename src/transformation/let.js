import estraverse from 'estraverse';
import _ from 'lodash';

export default
  function (ast) {
    estraverse.traverse(ast, {
      enter: replaceVar
    });
  }

let declarations = {};

function replaceVar(node) {
  if (node.type === "VariableDeclaration") {
    node.declarations.forEach(function(dec) {
      declarations[dec.id] = node;
      declarations[dec.id].kind = 'const';
    });
  }

  if (node.type === "AssignmentExpression") {
    declarations[node.left.property.name].kind = 'let';
  }
}
