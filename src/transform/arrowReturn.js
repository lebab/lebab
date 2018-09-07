import traverser from '../traverser';
import {matchesAst, matchesLength, extract} from '../utils/matchesAst';
import copyComments from '../utils/copyComments';

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

const matchesReturnBlock = matchesAst({
  type: 'BlockStatement',
  body: matchesLength([
    extract('returnStatement', {
      type: 'ReturnStatement',
      argument: extract('returnVal')
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
