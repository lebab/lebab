import estraverse from 'estraverse';
import ArrowExpression from './../syntax/arrow-expression.js';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: callBackToArrow
    });
  }

function callBackToArrow(node) {

  if (node.type === 'FunctionExpression' && !hasThis(node.body)) {
    let arrow = new ArrowExpression();
    arrow.body = node.body;
    arrow.params = node.params;
    arrow.rest = node.rest;
    arrow.defaults = node.defaults;
    arrow.generator = node.generator;
    arrow.id = node.id;

    return arrow;
  }

}

function hasThis(ast) {
  var thisFound = false;

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
