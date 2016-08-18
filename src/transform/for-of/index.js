import _ from 'lodash';
import traverser from '../../traverser';
import isEqualAst from '../../utils/is-equal-ast';
import matchAliasedForLoop from './match-aliased-for-loop';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchAliasedForLoop(node);

      if (matches && !indexUsedInBody(matches)) {
        return createForOf(matches);
      }

      if (node.type === 'ForStatement') {
        logger.warn(node, 'Unable to transform for loop', 'for-of');
      }
    }
  });
}

function indexUsedInBody({body, index}) {
  return traverser.find(removeFirstBodyElement(body), (node) => isEqualAst(node, index));
}

function createForOf({kind, item, array, body}) {
  return {
    type: 'ForOfStatement',
    left: {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: item,
          init: null
        }
      ],
      kind: kind
    },
    right: array,
    body: removeFirstBodyElement(body)
  };
}

function removeFirstBodyElement(body) {
  return Object.assign({}, body, {
    body: _.tail(body.body)
  });
}
