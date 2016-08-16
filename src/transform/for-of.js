import _ from 'lodash';
import traverser from '../traverser';
import {matchesAst, extract} from '../utils/matches-ast';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchForLoop(node);
      if (
        matches &&
        consistentIndexVar(matches) &&
        consistentArrayVar(matches)
      ) {
        return createForOf(matches);
      }
    }
  });
}

function consistentIndexVar({index, indexComparison, indexIncrement, indexReference}) {
  return identEquals(index, indexComparison) &&
    identEquals(index, indexIncrement) &&
    identEquals(index, indexReference);
}

function consistentArrayVar({array, arrayReference}) {
  return identEquals(array, arrayReference);
}

function identEquals(a, b) {
  return a.name === b.name;
}

var matchForLoop = matchesAst({
  'type': 'ForStatement',
  'init': {
    'type': 'VariableDeclaration',
    'declarations': [
      {
        'type': 'VariableDeclarator',
        'id': extract('index', {
          'type': 'Identifier',
        }),
        'init': {
          'type': 'Literal',
          'value': 0,
        }
      }
    ]
  },
  'test': {
    'type': 'BinaryExpression',
    'operator': '<',
    'left': extract('indexComparison', {
      'type': 'Identifier',
    }),
    'right': {
      'type': 'MemberExpression',
      'computed': false,
      'object': extract('array', {
        'type': 'Identifier',
      }),
      'property': {
        'type': 'Identifier',
        'name': 'length'
      }
    }
  },
  'update': {
    'type': 'UpdateExpression',
    'operator': '++',
    'argument': extract('indexIncrement', {
      'type': 'Identifier',
    }),
    'prefix': false
  },
  'body': extract('body', {
    'type': 'BlockStatement',
    'body': [
      {
        'type': 'VariableDeclaration',
        'declarations': [
          {
            'type': 'VariableDeclarator',
            'id': extract('item', {
              'type': 'Identifier',
            }),
            'init': {
              'type': 'MemberExpression',
              'computed': true,
              'object': extract('arrayReference', {
                'type': 'Identifier',
              }),
              'property': extract('indexReference', {
                'type': 'Identifier',
              })
            }
          }
        ],
        'kind': extract('kind')
      }
    ]
  })
});

function createForOf({kind, item, array, body}) {
  return {
    'type': 'ForOfStatement',
    'left': {
      'type': 'VariableDeclaration',
      'declarations': [
        {
          'type': 'VariableDeclarator',
          'id': item,
          'init': null
        }
      ],
      'kind': kind
    },
    'right': array,
    'body': removeFirstBodyElement(body)
  };
}

function removeFirstBodyElement(body) {
  return Object.assign({}, body, {
    body: _.tail(body.body)
  });
}
