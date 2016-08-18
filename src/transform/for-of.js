import _ from 'lodash';
import traverser from '../traverser';
import isEqualAst from '../utils/is-equal-ast';
import {matchesAst, extract, matchesLength} from '../utils/matches-ast';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchForLoop(node);

      if (
        matches &&
        consistentIndexVar(matches) &&
        consistentArrayVar(matches) &&
        !indexUsedInBody(matches)
      ) {
        return createForOf(matches);
      }

      if (node.type === 'ForStatement') {
        logger.warn(node, 'Unable to transform for loop', 'for-of');
      }
    }
  });
}

function consistentIndexVar({index, indexComparison, indexIncrement, indexReference}) {
  return isEqualAst(index, indexComparison) &&
    isEqualAst(index, indexIncrement) &&
    isEqualAst(index, indexReference);
}

function consistentArrayVar({array, arrayReference}) {
  return isEqualAst(array, arrayReference);
}

function indexUsedInBody({body, index}) {
  let indexFound = false;
  traverser.traverse(removeFirstBodyElement(body), {
    enter(node) {
      if (node.type === 'Identifier' && node.name === index.name) {
        indexFound = true;
        return traverser.VisitorOption.Break;
      }
    }
  });
  return indexFound;
}

var matchForLoop = matchesAst({
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
    ])
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
        kind: extract('kind')
      }
    ]
  })
});

// Matches <ident>++ or ++<ident>
var matchPlusPlus = matchesAst({
  type: 'UpdateExpression',
  operator: '++',
  argument: extract('indexIncrement', {
    type: 'Identifier',
  })
});

// Matches <ident>+=1
var matchPlusOne = matchesAst({
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
