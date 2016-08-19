import _ from 'lodash';
import traverser from '../../traverser';
import isEqualAst from '../../utils/is-equal-ast';
import {isReference} from '../../utils/variable-type';
import matchAliasedForLoop from './match-aliased-for-loop';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchAliasedForLoop(node);

      if (matches) {
        if (indexUsedInBody(matches)) {
          logger.warn(node, 'Index variable used in for-loop body', 'for-of');
          return;
        }

        if (matches.itemKind === 'var' || matches.indexKind === 'var') {
          logger.warn(node, 'Only for-loops with let/const can be tranformed (use let transform first)', 'for-of');
          return;
        }

        return createForOf(matches);
      }

      if (node.type === 'ForStatement') {
        logger.warn(node, 'Unable to transform for loop', 'for-of');
      }
    }
  });
}

function indexUsedInBody({body, index}) {
  return traverser.find(removeFirstBodyElement(body), (node, parent) => {
    return isEqualAst(node, index) && isReference(node, parent);
  });
}

function createForOf({item, itemKind, array, body}) {
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
      kind: itemKind
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
