import {tail} from 'lodash/fp';
import traverser from '../../traverser';
import isEqualAst from '../../utils/isEqualAst';
import {isReference} from '../../utils/variableType';
import copyComments from '../../utils/copyComments';
import matchAliasedForLoop from '../../utils/matchAliasedForLoop';
import validateForLoop from './validateForLoop';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchAliasedForLoop(node);

      if (matches) {
        const warning = validateForLoop(node, matches);
        if (warning) {
          logger.warn(...warning, 'for-each');
          return;
        }

        return withComments(node, createForEach(matches));
      }

      if (node.type === 'ForStatement') {
        logger.warn(node, 'Unable to transform for loop', 'for-each');
      }
    }
  });
}

function withComments(node, forEach) {
  copyComments({from: node, to: forEach});
  copyComments({from: node.body.body[0], to: forEach});
  return forEach;
}

function createForEach({body, item, index, array}) {
  const newBody = removeFirstBodyElement(body);
  const params = createForEachParams(newBody, item, index);
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: array,
        property: {
          type: 'Identifier',
          name: 'forEach'
        }
      },
      arguments: [{
        type: 'ArrowFunctionExpression',
        params,
        body: newBody
      }]
    }
  };
}

function removeFirstBodyElement(body) {
  return {
    ...body,
    body: tail(body.body),
  };
}

function createForEachParams(newBody, item, index) {
  if (indexUsedInBody(newBody, index)) {
    return [item, index];
  }
  return [item];
}

function indexUsedInBody(newBody, index) {
  return traverser.find(newBody, (node, parent) => {
    return isEqualAst(node, index) && isReference(node, parent);
  });
}
