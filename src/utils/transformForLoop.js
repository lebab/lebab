import _ from 'lodash';
import traverser from '../traverser';
import copyComments from '../utils/copyComments';
import {matchesAst} from '../utils/matchesAst';

export function withComments(node, forEach) {
  copyComments({from: node, to: forEach});
  copyComments({from: node.body.body[0], to: forEach});
  return forEach;
}

export function transformForLoopBodyElement({body, item, index, array}) {
  return replaceArrayItemInBodyElement({
    body: removeFirstBodyElement(body),
    item,
    index,
    array
  });
}

export function removeFirstBodyElement(body) {
  return Object.assign({}, body, {
    body: _.tail(body.body)
  });
}

function replaceArrayItemInBodyElement({body, item, index, array}) {
  traverser.replace(body, {
    enter(node) {
      const matches = matchesItem(index, array)(node);
      if (matches) {
        return item;
      }
    }
  });

  return body;
}

function matchesItem(index, array) {
  return matchesAst({
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: array.name
    },
    property: {
      type: 'Identifier',
      name: index.name
    }
  });
}
