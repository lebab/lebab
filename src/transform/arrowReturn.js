import traverser from '../traverser';
import {matchesAst, matchesLength, extract} from '../utils/matchesAst';
import copyComments from '../utils/copyComments';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isArrowFunction(node)) {
        return arrowReturn(node);
      }
    }
  });
}

function arrowReturn(node) {
  node.body = extractArrowBody(node.body);
  return node;
}

function isArrowFunction(node) {
  return node.type === 'ArrowFunctionExpression';
}

const matchesReturnBlock = matchesAst({
  type: 'BlockStatement',
  body: matchesLength([
    extract('returnStatement', {
      type: 'ReturnStatement',
      argument: extract('returnVal')
    })
  ])
});

function extractArrowBody(block) {
  const {returnStatement, returnVal} = matchesReturnBlock(block) || {};
  if (returnVal) {
    // preserve return statement comments
    copyComments({from: returnStatement, to: returnVal});
    return returnVal;
  }
  else {
    return block;
  }
}
