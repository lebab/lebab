import {flow, map, uniq, compact} from 'lodash/fp';
import traverser from '../traverser';
import * as functionType from '../utils/functionType';
import * as variableType from '../utils/variableType';
import * as destructuring from '../utils/destructuring.js';
import multiReplaceStatement from '../utils/multiReplaceStatement';
import ScopeManager from '../scope/ScopeManager';
import VariableMarker from '../scope/VariableMarker';
import FunctionHoister from '../scope/FunctionHoister';
import VariableDeclaration from '../syntax/VariableDeclaration';

let logger;
let scopeManager;

export default function(ast, loggerInstance) {
  logger = loggerInstance;
  scopeManager = new ScopeManager();
  const variableMarker = new VariableMarker(scopeManager);

  traverser.traverse(ast, {
    enter(node, parent) {
      if (node.type === 'Program') {
        enterProgram(node);
      }
      else if (functionType.isFunctionDeclaration(node)) {
        enterFunctionDeclaration(node);
      }
      else if (functionType.isFunctionExpression(node)) {
        enterFunctionExpression(node);
      }
      else if (isBlockScopedStatement(node)) {
        scopeManager.enterBlock();
      }
      else if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(decl => {
          variableMarker.markDeclared(
            destructuring.extractVariableNames(decl.id)
          );

          // Uninitialized variables can never be const.
          // But variables in for-in/of loop heads are actually initialized (although init === null).
          const inForLoopHead = isAnyForStatement(parent) && parent.left === node;
          if (decl.init === null && !inForLoopHead) { // eslint-disable-line no-null/no-null
            variableMarker.markModified(decl.id.name);
          }
        });
      }
      else if (node.type === 'AssignmentExpression') {
        destructuring.extractVariableNames(node.left).forEach(name => {
          variableMarker.markModified(name);
        });
      }
      else if (variableType.isUpdate(node)) {
        variableMarker.markModified(node.argument.name);
      }
      else if (variableType.isReference(node, parent)) {
        variableMarker.markReferenced(node.name);
      }
    },
    leave(node) {
      if (node.type === 'Program') {
        leaveProgram();
      }
      else if (functionType.isFunction(node)) {
        leaveFunction();
      }
      else if (isBlockScopedStatement(node)) {
        scopeManager.leaveScope();
      }
    },
  });
}

// Block scope is usually delimited by { ... }
// But for-loop heads also constitute a block scope.
function isBlockScopedStatement(node) {
  return node.type === 'BlockStatement' || isAnyForStatement(node);
}

// True when dealing with any kind of for-loop
function isAnyForStatement(node) {
  return node.type === 'ForStatement' ||
  node.type === 'ForInStatement' ||
  node.type === 'ForOfStatement';
}

// True when dealing with any kind of while-loop
function isAnyWhileStatement(node) {
  return node.type === 'WhileStatement' ||
  node.type === 'DoWhileStatement';
}

// Program node works almost like a function:
// it hoists all variables which can be transformed to block-scoped let/const.
// It just doesn't have name and parameters.
// So we create an implied FunctionScope and BlockScope.
function enterProgram(node) {
  scopeManager.enterFunction();
  hoistFunction({body: node});
  scopeManager.enterBlock();
}

// FunctionDeclaration has it's name visible outside the function,
// so we first register it in surrounding block-scope and
// after that enter new FunctionScope.
function enterFunctionDeclaration(func) {
  if (func.id) {
    getScope().register(
      func.id.name,
      getScope().findFunctionScoped(func.id.name)
    );
  }

  scopeManager.enterFunction();

  hoistFunction({params: func.params, body: func.body});
}

// FunctionExpression has it's name visible only inside the function,
// so we first enter new FunctionScope and
// hoist function name and params variables inside it.
function enterFunctionExpression(func) {
  scopeManager.enterFunction();

  hoistFunction({id: func.id, params: func.params, body: func.body});
}

function hoistFunction(cfg) {
  new FunctionHoister(getScope()).hoist(cfg);
}

// Exits the implied BlockScope and FunctionScope of Program node
function leaveProgram() {
  scopeManager.leaveScope();
  leaveFunction();
}

// Exits FunctionScope but first transforms all variables inside it
function leaveFunction() {
  transformVarsToLetOrConst();
  scopeManager.leaveScope();
}

// This is where the actual transform happens
function transformVarsToLetOrConst() {
  getFunctionVariableGroups().forEach(group => {
    // Do not modify existing let & const
    if (group.getNode().kind !== 'var') {
      return;
    }

    if (isLexicalVariableProhibited(group)) {
      logWarningForVarKind(group.getNode());
      return;
    }

    const commonKind = group.getCommonKind();
    if (commonKind) {
      // When all variables in group are of the same kind,
      // just set appropriate `kind` value for the existing
      // VariableDeclaration node.
      group.getNode().kind = commonKind;
      logWarningForVarKind(group.getNode());
    }
    else if (hasMultiStatementBody(group.getParentNode())) {
      // When some variables are of a different kind,
      // create separate VariableDeclaration nodes for each
      // VariableDeclarator and set their `kind` value appropriately.
      const varNodes = group.getVariables().map(v => {
        return new VariableDeclaration(v.getKind(), [v.getNode()]);
      });

      multiReplaceStatement({
        parent: group.getParentNode(),
        node: group.getNode(),
        replacements: varNodes,
        preserveComments: true,
      });

      logWarningForVarKind(group.getNode());
    }
    else {
      // When parent node restricts breaking VariableDeclaration to multiple ones
      // just change the kind of the declaration to the most restrictive possible

      // If any variable is hoisted (was already declared) and is redeclared here,
      // that must mean that the previous declaration was with var and the current
      // declaration is with var (it would be a javascript runtime error otherwise)
      // In that case, we cannot change the type to anything other than var.
      if (getScope().getVariables().some(v => v.hoisted)) {
        return;
      }

      group.getNode().kind = group.getMostRestrictiveKind();
      logWarningForVarKind(group.getNode());
    }
  });
}

// let and const declarations aren't allowed in all the same places where
// var declarations are allowed. Notably, only var-declaration can occur
// directlt in if-statement (and other similar statements) body:
//
//     if (true) var x = 10;
//
// let or const can only be used when the variable is declared in inside
// a block-statement:
//
//     if (true) { const x = 10; }
//
function isLexicalVariableProhibited(group) {
  const node = group.getNode();
  const parentNode = group.getParentNode();

  if (parentNode.type === 'IfStatement') {
    return parentNode.consequent === node || parentNode.alternate === node;
  }

  if (isAnyForStatement(parentNode) || isAnyWhileStatement(parentNode)) {
    return parentNode.body === node;
  }

  return false;
}

function logWarningForVarKind(node) {
  if (node.kind === 'var') {
    logger.warn(node, 'Unable to transform var', 'let');
  }
}

// Does a node have body that can contain an array of statements
function hasMultiStatementBody(node) {
  return node.type === 'BlockStatement' ||
    node.type === 'Program' ||
    node.type === 'SwitchCase';
}

// Returns all VariableGroups of variables in current function scope,
// including from all the nested block-scopes (but not the nested
// functions).
function getFunctionVariableGroups() {
  return flow(
    map(v => v.getGroup()),
    uniq,
    compact
  )(getScope().getVariables());
}

function getScope() {
  return scopeManager.getScope();
}
