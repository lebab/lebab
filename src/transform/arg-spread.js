import _ from 'lodash';
import estraverse from 'estraverse';
import {matchesAst, extract} from '../utils/matches-ast';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      const {func, array} = matchFunctionApplyCall(node);
      if (func) {
        return createCallWithSpread(func, array);
      }

      const {memberExpr, thisParam, arrayParam} = matchObjectApplyCall(node);
      if (memberExpr && _.isEqual(omitLoc(memberExpr.object), omitLoc(thisParam))) {
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

// Recursively strips `loc` fields from given object and its nested objects,
// removing the location information that we don't care about when comparing
// AST nodes.
function omitLoc(obj) {
  if (_.isArray(obj)) {
    return obj.map(omitLoc);
  }
  else if (_.isObjectLike(obj)) {
    return _(obj).omit('loc').mapValues(omitLoc).value();
  }
  else {
    return obj;
  }
}

var isUndefined = matchesAst({
  type: 'Identifier',
  name: 'undefined'
});

var isNull = matchesAst({
  type: 'Literal',
  value: null,
  raw: 'null'
});

var matchFunctionApplyCall = matchesAst({
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
    node => isUndefined(node) || isNull(node),
    extract('array')
  ]
});

var matchObjectApplyCall = matchesAst({
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
