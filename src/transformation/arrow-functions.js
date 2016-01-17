import estraverse from 'estraverse';
import ArrowFunctionExpression from './../syntax/arrow-function-expression.js';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: callBackToArrow
    });
  }

function callBackToArrow(node) {
  if (isFunctionConvertableToArrow(node)) {
    return new ArrowFunctionExpression({
      body: extractArrowBody(node.body),
      params: node.params,
      defaults: node.defaults,
      rest: node.rest,
    });
  }
}

function isFunctionConvertableToArrow(node) {
  return node.type === 'FunctionExpression' &&
    !node.id &&
    !node.generator &&
    !hasThis(node.body) &&
    !hasArguments(node.body);
}

function hasThis(ast) {
  let thisFound = false;

  estraverse.traverse(ast, {
    enter: function (node) {
      if (node.type === 'ThisExpression') {
        thisFound = true;
        this.break();
      }
      if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
        this.skip();
      }
    }
  });

  return thisFound;
}

function hasArguments(ast) {
  let argumentsFound = false;

  estraverse.traverse(ast, {
    enter: function (node) {
      if (node.type === 'Identifier' && node.name === 'arguments') {
        argumentsFound = true;
        this.break();
      }
      if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
        this.skip();
      }
    }
  });

  return argumentsFound;
}

function extractArrowBody(block) {
  if (block.body[0] && block.body[0].type === 'ReturnStatement') {
    return block.body[0].argument;
  } else {
    return block;
  }
}
