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
      else if (isPrototypeFunctionAssignment(node)) {
        const {left, right} = node.expression;
        const name = left.object.object.name;
        if (potentialClasses[name]) {
          potentialClasses[name].addMethod(new PotentialMethod({
            name: left.property.name,
            methodNode: right,
            fullNode: node,
            parent,
          }));
        }
      }
      else if (isPrototypeObjectAssignment(node)) {
        const {left: {object: {name}}, right: {properties}} = node.expression;
        if (potentialClasses[name] && properties.every(isFunctionProperty)) {
          properties.forEach(prop => {
            potentialClasses[name].addMethod(new PotentialMethod({
              name: prop.key.name,
              methodNode: prop.value,
              fullNode: node,
              parent,
            }));
          });
        }
      }
      else if (isObjectDefinePropertyCall(node)) {
        const clsName = node.expression.arguments[0].object.name;
        const propName = node.expression.arguments[1].value;
        const descriptor = node.expression.arguments[2];
        if (potentialClasses[clsName] && _(descriptor.properties).every(isAccessorDescriptor)) {
          descriptor.properties.forEach(prop => {
            potentialClasses[clsName].addMethod(new PotentialMethod({
              name: propName,
              methodNode: prop.value,
              fullNode: node,
              parent,
              kind: prop.key.name,
            }));
          });
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
function isFunctionVariableDeclaration(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.length === 1 &&
    node.declarations[0].init &&
    node.declarations[0].init.type === 'FunctionExpression';
}

// Matches: <SomeClass>.prototype.<ident> = function () { ... }
var isPrototypeFunctionAssignment = _.matches({
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
    right: {
      type: 'FunctionExpression'
    }
  }
});

// Matches: <SomeClass>.prototype = { ... };
var isPrototypeObjectAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
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
    operator: '=',
    right: {
      type: 'ObjectExpression'
    }
  }
});

// Matches: Object.defineProperty(<SomeClass>.prototype, <string>, {})
var isObjectDefinePropertyCall = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'Object'
      },
      property: {
        type: 'Identifier',
        name: 'defineProperty'
      }
    },
    arguments: [
      {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          // name: <SomeClass>
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        }
      },
      {
        type: 'Literal',
        // value: <string>
      },
      {
        type: 'ObjectExpression',
      }
    ]
  }
});

function isAccessorDescriptor(node) {
  return isFunctionProperty(node) &&
    (node.key.name === 'get' || node.key.name === 'set');
}

// Matches: <ident>: function() { ... }
var isFunctionProperty = _.matches({
  type: 'Property',
  key: {
    type: 'Identifier',
    // name: <ident>
  },
  computed: false,
  value: {
    type: 'FunctionExpression'
  }
});
