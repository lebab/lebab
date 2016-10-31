import _ from 'lodash';
import recast from 'recast';
import parser from '../Parser';
import traverser from '../traverser';
import withScope from '../withScope';
import * as functionType from '../utils/functionType';
import Hierarchy from '../utils/Hierarchy';

export default function(ast) {
  const hierarchy = new Hierarchy(ast);

  traverser.traverse(ast, withScope(ast, {
    enter(fnNode, parent, scope) {
      if (functionType.isFunction(fnNode)) {
        scope.variables
          .filter(isParameter)
          .map(v => ({variable: v, exs: getMemberExpressions(v, hierarchy)}))
          .filter(({exs}) => exs.length > 0)
          .forEach(({variable, exs}) => {
            // Replace parameter with destruct-pattern
            const index = fnNode.params.findIndex(param => param === variable.defs[0].name);
            if (index === -1) {
              return;
            }
            fnNode.params[index] = createDestructPattern(exs);

            // Replace references of obj.foo with simply foo
            exs.forEach(ex => {
              ex.type = ex.property.type;
              ex.name = ex.property.name;
            });
          });
      }
    }
  }));
}

function isParameter(variable) {
  return variable.defs.length === 1 && variable.defs[0].type === 'Parameter';
}

function getMemberExpressions(variable, hierarchy) {
  const memberExpressions = [];
  for (const ref of variable.references) {
    const memEx = hierarchy.getParent(ref.identifier);
    if (!isMemberExpressionObject(memEx, ref.identifier)) {
      return [];
    }

    const ex = hierarchy.getParent(memEx);
    if (isAssignment(ex, memEx) || isUpdate(ex, memEx)) {
      return [];
    }

    memberExpressions.push(memEx);
  }
  return memberExpressions;
}

function isMemberExpressionObject(memEx, object) {
  return memEx.type === 'MemberExpression' &&
    memEx.object === object &&
    memEx.computed === false;
}

function isAssignment(ex, node) {
  return ex.type === 'AssignmentExpression' &&
    ex.left === node;
}

function isUpdate(ex, node) {
  return ex.type === 'UpdateExpression' &&
    ex.argument === node;
}

// By default recast indents the ObjectPattern AST node
// See: https://github.com/benjamn/recast/issues/240
//
// To work around this, we're building the desired string by ourselves,
// and parsing it with Recast and extracting the ObjectPatter node.
// Feeding this back to Recast will preserve the formatting.
function createDestructPattern(exs) {
  const props = _(exs).map(({property}) => property.name).uniq().join(', ');
  const js = `function foo({${props}}) {};`;
  const ast = recast.parse(js, {parser});
  return ast.program.body[0].params[0];
}
