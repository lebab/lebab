import chain from '../utils/chainFunc';
import isEqual from 'lodash/isEqual';
import traverser from '../traverser';
import {matchesAst, isAstMatch, extract} from '../utils/matchesAst';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      const {func, array} = matchFunctionApplyCall(node);
      if (func) {
        return createCallWithSpread(func, array);
      }

      const {memberExpr, thisParam, arrayParam} = matchObjectApplyCall(node);
      if (memberExpr && isEqual(omitLoc(memberExpr.object), omitLoc(thisParam))) {
        return createCallWithSpread(memberExpr, arrayParam);
      }
    }
  });
}

function createCallWithSpread(func, array) {
  return {
    type: 'CallExpression',
    callee: func,
    arguments: [
      {
        type: 'SpreadElement',
        argument: array,
      }
    ]
  };
}

// Recursively strips `loc`, `start` and `end` fields from given object and its nested objects,
// removing the location information that we don't care about when comparing
// AST nodes.
function omitLoc(obj) {
  if (Array.isArray(obj)) {
    return obj.map(omitLoc);
  }
  else if (obj && typeof obj === 'object') {
    return chain(obj).omit('loc', 'start', 'end').mapValues(omitLoc).value();
  }
  else {
    return obj;
  }
}

const isUndefined = matchesAst({
  type: 'Identifier',
  name: 'undefined'
});

const isNull = matchesAst({
  type: 'Literal',
  value: null, // eslint-disable-line no-null/no-null
  raw: 'null'
});

function matchFunctionApplyCall(node) {
  return isAstMatch(node, {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: extract('func', {
        type: 'Identifier'
      }),
      property: {
        type: 'Identifier',
        name: 'apply'
      }
    },
    arguments: [
      arg => isUndefined(arg) || isNull(arg),
      extract('array')
    ]
  });
}

function matchObjectApplyCall(node) {
  return isAstMatch(node, {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: extract('memberExpr', {
        type: 'MemberExpression',
      }),
      property: {
        type: 'Identifier',
        name: 'apply'
      }
    },
    arguments: [
      extract('thisParam'),
      extract('arrayParam')
    ]
  });
}
