import {matches} from 'lodash/fp';
import traverser from '../traverser';
import ArrowFunctionExpression from '../syntax/ArrowFunctionExpression';
import {isAstMatch, extract} from '../utils/matchesAst';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (isFunctionConvertableToArrow(node, parent)) {
        if (hasArguments(node.body)) {
          logger.warn(node, 'Can not use arguments in arrow function', 'arrow');
          return;
        }
        return functionToArrow(node);
      }

      const {func} = matchBoundFunction(node);
      if (func) {
        return functionToArrow(func);
      }
    }
  });
}

function isFunctionConvertableToArrow(node, parent) {
  return (node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression') &&
    parent.type !== 'Property' &&
    parent.type !== 'MethodDefinition' &&
    !node.id &&
    !node.generator &&
    !hasThis(node.body);
}

// Matches: function(){}.bind(this)
function matchBoundFunction(node) {
  return isAstMatch(node, {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: extract('func', {
        type: 'FunctionExpression',
        id: null, // eslint-disable-line no-null/no-null
        body: body => !hasArguments(body),
        generator: false
      }),
      property: {
        type: 'Identifier',
        name: 'bind'
      }
    },
    arguments: [
      {
        type: 'ThisExpression'
      }
    ]
  });
}

function hasThis(ast) {
  return hasInFunctionBody(ast, {type: 'ThisExpression'});
}

function hasArguments(ast) {
  return hasInFunctionBody(ast, {type: 'Identifier', name: 'arguments'});
}

// Returns true when pattern matches any node in given function body,
// excluding any nested functions
function hasInFunctionBody(ast, pattern) {
  return traverser.find(ast, matches(pattern), {
    skipTypes: ['FunctionExpression', 'FunctionDeclaration', 'ArrowFunctionExpression']
  });
}

function functionToArrow(func) {
  return new ArrowFunctionExpression({
    body: func.body,
    params: func.params,
    defaults: func.defaults,
    rest: func.rest,
    async: func.async,
  });
}

