import estraverse from 'estraverse';
import matchDefaultExport from './match-default-export';
import matchNamedFunctionExport from './match-named-function-export';

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
      if ((m = matchNamedFunctionExport(node)) && parent.type === 'Program') {
        return {
          type: 'ExportNamedDeclaration',
          declaration: functionExpressionToDeclaration(m)
        };
      }
    }
  });
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
