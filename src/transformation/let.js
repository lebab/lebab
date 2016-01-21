import estraverse from 'estraverse';
import _ from 'lodash';
import typeChecker from '../utils/type-checker.js';

export default
  function (ast) {
    estraverse.traverse(ast, {
      enter: function(node) {
        if (node.type === 'Program' || typeChecker.isES6Function(node)) {
          return enterFunctionScope(node);
        }
        if (node.type === 'VariableDeclaration') {
          return enterVariableDeclaration(node);
        }
        if (node.type === 'AssignmentExpression' && node.left.type === 'Identifier') {
          return enterAssignmentExpression(node);
        }
        if (node.type === 'UpdateExpression' && node.argument.type === 'Identifier') {
          return enterUpdateExpression(node);
        }
      },
      leave: function(node) {
        if (node.type === 'Program' || typeChecker.isES6Function(node)) {
          return leaveFunctionScope(node);
        }
      },
    });
  }

const functionScopeStack = [];

function enterFunctionScope() {
  functionScopeStack.push({});
}

function leaveFunctionScope() {
  functionScopeStack.pop();
}

function enterVariableDeclaration(node) {
  const currentScope = _.last(functionScopeStack);

  node.declarations.forEach(dec => {
    const varName = dec.id.name;

    currentScope[varName] = node;
    currentScope[varName].kind = 'const';
  });
}

function enterAssignmentExpression(node) {
  const varName = node.left.name;
  findVar(varName).kind = 'let';
}

function enterUpdateExpression(node) {
  const varName = node.argument.name;
  findVar(varName).kind = 'let';
}

// Looks up variable starting from current scope and
// traveling up to the outermost scope
function findVar(varName) {
  const scope = _(functionScopeStack).findLast(varName);
  return scope ? scope[varName] : {};
}
