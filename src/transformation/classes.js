import _ from 'lodash';
import estraverse from 'estraverse';
import PotentialClass from './../classes/potential-class.js';
import PotentialMethod from './../classes/potential-method.js';
import * as functionType from './../utils/function-type.js';

export default
function (ast) {
  const potentialClasses = {};

  estraverse.traverse(ast, {
    enter(node, parent) {
      if (functionType.isFunctionDeclaration(node)) {
        const name = node.id.name;
        potentialClasses[name] = new PotentialClass({
          name,
          constructor: new PotentialMethod({
            name: 'constructor',
            methodNode: node,
          }),
          fullNode: node,
          parent,
        });
      }
      else if (isFunctionVariableDeclaration(node)) {
        const name = node.declarations[0].id.name;
        potentialClasses[name] = new PotentialClass({
          name,
          constructor: new PotentialMethod({
            name: 'constructor',
            methodNode: node.declarations[0].init,
          }),
          fullNode: node,
          parent,
        });
      }
      else if (isPrototypeAssignment(node)) {
        const {left, right} = node.expression;
        const name = left.object.object.name;
        if (potentialClasses[name] && functionType.isFunctionExpression(right)) {
          potentialClasses[name].addMethod(new PotentialMethod({
            name: left.property.name,
            methodNode: right,
            fullNode: node,
            parent,
          }));
        }
      }
    },
    leave(node) {
      if (node.type === 'Program') {
        _(potentialClasses)
          .filter(cls => cls.isTransformable())
          .forEach(cls => cls.transform())
          .value();
      }
    }
  });
}

// Matches: var <ident> = function () { ... }
//          var <ident> = () => ...
function isFunctionVariableDeclaration(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.length === 1 &&
    node.declarations[0].init &&
    functionType.isFunctionExpression(node.declarations[0].init);
}

// Matches: <SomeClass>.prototype.<ident> = ...
var isPrototypeAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          // name: <SomeClass>
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        },
      },
      property: {
        type: 'Identifier',
        // name: <ident>
      }
    },
    operator: '=',
  }
});
