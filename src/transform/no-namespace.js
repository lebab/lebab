import traverser from '../traverser';
import {matchesAst, extract} from '../utils/matches-ast';
// import ArrowFunctionExpression from '../syntax/arrow-function-expression';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      var m;
      if ((m = isNamespacedClass(node))) {
        return {
          type: 'FunctionExpression',
          id: m.className,
          params: m.params,
          body: m.body
        };
      }
      else if ((m = isNamespacedMethod(node))) {
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              object: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: m.className
                },
                property: {
                  type: 'Identifier',
                  name: 'prototype'
                }
              },
              property: {
                type: 'Identifier',
                name: m.methodName
              }
            },
            right: {
              type: 'FunctionExpression',
              id: null,
              params: m.params,
              body: m.body
            }
          }
        };
      }
      else if ((m = isNamespacedStaticMethod(node))) {
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: m.className
              },
              property: {
                type: 'Identifier',
                name: m.methodName
              }
            },
            right: {
              type: 'FunctionExpression',
              id: null,
              params: m.params,
              body: m.body
            }
          }
        };
      }
    }
  });
}

var isNamespacedClass = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      property: ast => {
        if (ast.type === 'Identifier' && ast.name !== 'prototype' && ast.name[0] === ast.name[0].toUpperCase()) {
          return {className: ast.name};
        }
      }
    },
    operator: '=',
    right: extract('methodNode', {
      type: 'FunctionExpression',
      params: extract('params'),
      body: extract('body')
    })
  }
});

var isNamespacedMethod = matchesAst({
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
          type: 'MemberExpression',
          computed: false,
          property: {
            type: 'Identifier',
            name: extract('className')
          }
        },
        property: {
          type: 'Identifier',
          name: 'prototype'
        }
      },
      property: {
        type: 'Identifier',
        name: extract('methodName')
      }
    },
    operator: '=',
    right: extract('methodNode', {
      type: 'FunctionExpression',
      params: extract('params'),
      body: extract('body')
    })
  }
});

var isNamespacedStaticMethod = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'MemberExpression',
        computed: false,
        property: {
          type: 'Identifier',
          name: extract('className')
        }
      },
      property: {
        type: 'Identifier',
        name: extract('methodName')
      }
    },
    operator: '=',
    right: extract('methodNode', {
      type: 'FunctionExpression',
      params: extract('params'),
      body: extract('body')
    })
  }
});
