// import _ from 'lodash';
import traverser from '../traverser';
import withScope from '../withScope';
import * as functionType from '../utils/functionType';

class Hierarchy {
  constructor(ast) {
    this.parents = new Map();

    traverser.traverse(ast, {
      enter: (node, parent) => {
        this.parents.set(node, parent);
      }
    });
  }

  getParent(node) {
    return this.parents.get(node);
  }
}

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

function createDestructPattern(exs) {
  return {
    type: 'ObjectPattern',
    properties: exs.map(({property}) => {
      return {
        type: 'Property',
        kind: 'init',
        shorthand: true,
        key: {
          type: 'Identifier',
          name: property.name,
        },
        value: {
          type: 'Identifier',
          name: property.name,
        },
      };
    })
  };
}
