import estraverse from 'estraverse';
// import AssignmentPattern from '../syntax/assignment-pattern';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: findDefaultAssignments
    });
    estraverse.replace(ast, {
      enter: removeExpressions
    });
  }

let lastFunction = {};

function findDefaultAssignments(node) {
  if (node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression') {
    lastFunction = node;
    lastFunction._args = node.params.map(function(arg) {
      return arg.name;
    });
    lastFunction.defaults = [];
  }

  if (node.type === 'ExpressionStatement') {
    node.expression._parent = node;
  }
  if (node.type === 'AssignmentExpression' &&
      lastFunction._args &&
      lastFunction._args.indexOf(node.left.name) > -1 &&
      node.right.type === 'LogicalExpression' &&
      node.right.operator === '||' &&
      node.right.left.name === node.left.name) {

    const argIndex = lastFunction._args.indexOf(node.left.name);

    lastFunction.defaults[argIndex] = node.right.right;
    node._parent._remove = true;
  }
}

function removeExpressions(node) {
  if (node._remove) {
    return this.remove();
  }
}