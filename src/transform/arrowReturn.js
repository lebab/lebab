import traverser from '../traverser';
import {matches, matchesLength, extract} from 'f-matches';
import copyComments from '../utils/copyComments';
import {isNull, negate} from 'lodash/fp';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isShortenableArrowFunction(node)) {
        return shortenReturn(node);
      }
    }
  });
}

function shortenReturn(node) {
  node.body = extractArrowBody(node.body);
  return node;
}

const matchesReturnBlock = matches({
  type: 'BlockStatement',
  body: matchesLength([
    extract('returnStatement', {
      type: 'ReturnStatement',
      argument: extract('returnVal', negate(isNull))
    })
  ])
});

function isShortenableArrowFunction(node) {
  return node.type === 'ArrowFunctionExpression' &&
    matchesReturnBlock(node.body);
}

function extractArrowBody(block) {
  const {returnStatement, returnVal} = matchesReturnBlock(block);
  // preserve return statement comments
  copyComments({from: returnStatement, to: returnVal});
  return returnVal;
}
