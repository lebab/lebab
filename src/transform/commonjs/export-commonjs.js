import estraverse from 'estraverse';
import matchDefaultExport from './match-default-export';
import matchNamedExport from './match-named-export';
import {isFunctionExpression} from '../../utils/function-type';

export default function (ast) {
  estraverse.replace(ast, {
    enter(node, parent) {
      let m;
      if ((m = matchDefaultExport(node)) && parent.type === 'Program') {
        return {
          type: 'ExportDefaultDeclaration',
          declaration: m.value
        };
      }
      if ((m = matchNamedExport(node)) && parent.type === 'Program') {
        if (isFunctionExpression(m.value)) {
          // Exclude functions with different name than the assigned property name
          if (compatibleIdentifiers(m.id, m.value.id)) {
            return {
              type: 'ExportNamedDeclaration',
              declaration: functionExpressionToDeclaration(m.value, m.id)
            };
          }
        }
        else if (m.value.type === 'Identifier') {
          return {
            type: 'ExportNamedDeclaration',
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: m.id,
                local: m.value
              }
            ]
          };
        }
        else {
          return {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: m.id,
                  init: m.value
                }
              ]
            }
          };
        }
      }
    }
  });
}

// Trye when one of the identifiers is null or their names are equal.
function compatibleIdentifiers(id1, id2) {
  return !id1 || !id2 || id1.name === id2.name;
}

function functionExpressionToDeclaration(func, id) {
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
