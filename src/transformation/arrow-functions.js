import estraverse from 'estraverse';
import ArrowExpression from './../syntax/arrow-expression.js';
import _ from 'lodash';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: callBackToArrow
    });
  }

function callBackToArrow(node, parent) {

  if (node.type === 'FunctionExpression' && parent.type === 'CallExpression' && !hasThis(node)) {
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

const objectProps = ['body', 'expression', 'left', 'right', 'object'];

function hasThis(node) {

  if (_.isArray(node)) {
    for (let sub of node) {
      let result = hasThis(sub);
      if (result) {
        return result;
      }
    }

    return false;
  }

  if (node.type === 'ThisExpression') {
    return true;
  }

  for (let prop of objectProps) {
    if (node[prop]) {
      return hasThis(node[prop]);
    }
  }

  return false;

}