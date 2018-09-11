import {flow, omit, mapValues, isEqual, isArray, isObjectLike} from 'lodash/fp';
import traverser from '../traverser';
import {matches, extract, extractAny} from 'f-matches';

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
  if (isArray(obj)) {
    return obj.map(omitLoc);
  }
  else if (isObjectLike(obj)) {
    return flow(
      omit(['loc', 'start', 'end']),
      mapValues(omitLoc)
    )(obj);
  }
  else {
    return obj;
  }
}

const isUndefined = matches({
  type: 'Identifier',
  name: 'undefined'
});

const isNull = matches({
  type: 'Literal',
  value: null, // eslint-disable-line no-null/no-null
  raw: 'null'
});

function matchFunctionApplyCall(node) {
  return matches({
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
      extractAny('array')
    ]
  }, node);
}

function matchObjectApplyCall(node) {
  return matches({
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
      extractAny('thisParam'),
      extractAny('arrayParam')
    ]
  }, node);
}
