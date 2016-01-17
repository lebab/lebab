import estraverse from 'estraverse';
import ArrowExpression from './../syntax/arrow-expression.js';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: callBackToArrow
    });
  }

function callBackToArrow(node) {

  if (node.type === 'FunctionExpression' && !node.id && !hasThis(node.body)) {
    let arrow = new ArrowExpression();
    arrow.body = extractArrowBody(node.body);
    arrow.params = node.params;
    arrow.rest = node.rest;
    arrow.defaults = node.defaults;
    arrow.generator = node.generator;

    return arrow;
  }

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

function extractArrowBody(block) {
  if (block.body[0] && block.body[0].type === 'ReturnStatement') {
    return block.body[0].argument;
  } else {
    return block;
  }
}
