import estraverse from 'estraverse';
import {matchesAst, extract} from '../../utils/matches-ast';
import {isFunctionExpression} from '../../utils/function-type';
import ExportDefaultDeclaration from '../../syntax/export-default-declaration';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: traverse
    });
  }

function traverse(node, parent) {
  let m;
  if (isModuleExportsAssignment(node) && parent.type === 'Program') {
    return new ExportDefaultDeclaration(node.expression.right);
  }
  if ((m = matchNamedFunctionExport(node)) && parent.type === 'Program') {
    return {
      type: 'ExportNamedDeclaration',
      declaration: functionExpressionToDeclaration(m)
    };
  }
}

var isExports = matchesAst({
  type: 'Identifier',
  name: 'exports'
});

var isModuleExports = matchesAst({
  type: 'MemberExpression',
  computed: false,
  object: {
    type: 'Identifier',
    name: 'module'
  },
  property: isExports
});

// Matches: module.exports = ...
var isModuleExportsAssignment = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'module'
      },
      property: {
        type: 'Identifier',
        name: 'exports'
      }
    }
  }
});

// Matches: exports.<id> = <func>
// Matches: module.exports.<id> = <func>
var testNamedFunctionExport = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: (ast) => isExports(ast) || isModuleExports(ast),
      property: extract('id', {
        type: 'Identifier'
      })
    },
    right: extract('func', isFunctionExpression)
  }
});

function matchNamedFunctionExport(node) {
  const {id, func} = testNamedFunctionExport(node);

  // Exclude functions with different name than the assigned property name
  if (id && (!func.id || func.id.name === id.name)) {
    return {id, func};
  }
}

function functionExpressionToDeclaration({id, func}) {
  func.type = 'FunctionDeclaration';
  func.id = id;

  // Transform <expression> to { return <expression>; }
  if (func.body.type !== 'BlockStatement') {
    func.body = {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: func.body
        }
      ]
    };
  }

  return func;
}
