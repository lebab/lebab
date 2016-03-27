import _ from 'lodash';
import estraverse from 'estraverse';
import {matchesAst, extract} from '../utils/matches-ast';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      const {memberExpr, thisParam, arrayParam} = matchApplyCall(node);
      if (memberExpr && _.isEqual(omitLoc(memberExpr.object), omitLoc(thisParam))) {
        return {
          type: 'CallExpression',
          callee: memberExpr,
          arguments: [
            {
              type: 'SpreadElement',
              argument: arrayParam,
            }
          ]
        };
      }
    }
  });
}

// Recursively strips `loc` fields from given object and its nested objects,
// removing the location information that we don't care about when comparing
// AST nodes.
function omitLoc(obj) {
  if (_.isPlainObject(obj)) {
    return _(obj).omit('loc').mapValues(omitLoc).value();
  }
  else if (_.isArray(obj)) {
    return obj.map(omitLoc);
  }
  else {
    return obj;
  }
}

var matchApplyCall = matchesAst({
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
