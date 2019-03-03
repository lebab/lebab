import {matches as lodashMatches} from 'lodash/fp';
import traverser from '../traverser';
import ArrowFunctionExpression from '../syntax/ArrowFunctionExpression';
import {matches, matchesLength, extract} from 'f-matches';
import copyComments from '../utils/copyComments';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node, parent) {
      if (isFunctionConvertableToArrow(node, parent)) {
        if (hasArguments(node.body)) {
          logger.warn(node, 'Can not use arguments in arrow function', 'arrow');
          return;
        }
        return functionToArrow(node, parent);
      }

      const {func} = matchBoundFunction(node);
      if (func) {
        return functionToArrow(func, parent);
      }
    }
  });
}

function isFunctionConvertableToArrow(node, parent) {
  return node.type === 'FunctionExpression' &&
    parent.type !== 'Property' &&
    parent.type !== 'MethodDefinition' &&
    !node.id &&
    !node.generator &&
    !hasThis(node.body);
}

// Matches: function(){}.bind(this)
function matchBoundFunction(node) {
  return matches({
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
    arguments: matchesLength([
      {
        type: 'ThisExpression'
      }
    ])
  }, node);
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
  return traverser.find(ast, lodashMatches(pattern), {
    skipTypes: ['FunctionExpression', 'FunctionDeclaration']
  });
}

function functionToArrow(func, parent) {
  const arrow = new ArrowFunctionExpression({
    body: func.body,
    params: func.params,
    defaults: func.defaults,
    rest: func.rest,
    async: func.async,
  });

  copyComments({from: func, to: arrow});

  // Get rid of extra parentheses around IIFE
  // by forcing Recast to reformat the CallExpression
  if (isIIFE(func, parent)) {
    parent.original = null; // eslint-disable-line no-null/no-null
  }

  return arrow;
}

// Is it immediately invoked function expression?
function isIIFE(func, parent) {
  return parent.type === 'CallExpression' && parent.callee === func;
}
