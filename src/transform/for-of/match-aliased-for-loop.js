import isEqualAst from '../../utils/is-equal-ast';
import {matchesAst, extract, matchesLength} from '../../utils/matches-ast';

// Matches <ident>++ or ++<ident>
const matchPlusPlus = matchesAst({
  type: 'UpdateExpression',
  operator: '++',
  argument: extract('indexIncrement', {
    type: 'Identifier',
  })
});

// Matches <ident>+=1
const matchPlusOne = matchesAst({
  type: 'AssignmentExpression',
  operator: '+=',
  left: extract('indexIncrement', {
    type: 'Identifier',
  }),
  right: {
    type: 'Literal',
    value: 1
  }
});

// Matches for-loop
// without checking the consistency of index and array variables:
//
// for (let index = 0; indexComparison < array.length; indexIncrement++) {
//     let item = arrayReference[indexReference];
//     ...
// }
const matchLooseForLoop = matchesAst({
  type: 'ForStatement',
  init: {
    type: 'VariableDeclaration',
    declarations: matchesLength([
      {
        type: 'VariableDeclarator',
        id: extract('index', {
          type: 'Identifier',
        }),
        init: {
          type: 'Literal',
          value: 0,
        }
      }
    ]),
    kind: 'let'
  },
  test: {
    type: 'BinaryExpression',
    operator: '<',
    left: extract('indexComparison', {
      type: 'Identifier',
    }),
    right: {
      type: 'MemberExpression',
      computed: false,
      object: extract('array'),
      property: {
        type: 'Identifier',
        name: 'length'
      }
    }
  },
  update: (node) => matchPlusPlus(node) || matchPlusOne(node),
  body: extract('body', {
    type: 'BlockStatement',
    body: [
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: extract('item', {
              type: 'Identifier',
            }),
            init: {
              type: 'MemberExpression',
              computed: true,
              object: extract('arrayReference'),
              property: extract('indexReference', {
                type: 'Identifier',
              })
            }
          }
        ],
        kind: extract('kind', kind => kind === 'let' || kind === 'const')
      }
    ]
  })
});

function isConsistentIndexVar({index, indexComparison, indexIncrement, indexReference}) {
  return isEqualAst(index, indexComparison) &&
    isEqualAst(index, indexIncrement) &&
    isEqualAst(index, indexReference);
}

function isConsistentArrayVar({array, arrayReference}) {
  return isEqualAst(array, arrayReference);
}

/**
 * Matches for-loop that aliases current array element
 * in the first line of the loop body:
 *
 *     for (let index = 0; index < array.length; index++) {
 *         let item = array[index];
 *         ...
 *     }
 *
 * Extracts the following fields:
 *
 * - index - loop index identifier
 * - array - array identifier or expression
 * - item - identifier used to alias current array element
 * - kind - the kind of <item>
 * - body - the whole BlockStatement of for-loop body
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function(ast) {
  const matches = matchLooseForLoop(ast);
  if (matches && isConsistentIndexVar(matches) && isConsistentArrayVar(matches)) {
    return matches;
  }
}
