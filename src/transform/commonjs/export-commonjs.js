import estraverse from 'estraverse';
import matchDefaultExport from './match-default-export';
import matchNamedExport from './match-named-export';
import {isFunctionExpression} from '../../utils/function-type';
import ExportNamedDeclaration from '../../syntax/export-named-declaration';
import VariableDeclaration from '../../syntax/variable-declaration';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node, parent) {
      let m;
      if ((m = matchDefaultExport(node)) && parent.type === 'Program') {
        return exportDefault(m);
      }
      else if ((m = matchNamedExport(node)) && parent.type === 'Program') {
        return exportNamed(m);
      }
    }
  });
}

function exportDefault({value}) {
  return {
    type: 'ExportDefaultDeclaration',
    declaration: value
  };
}

function exportNamed({id, value}) {
  if (isFunctionExpression(value)) {
    // Exclude functions with different name than the assigned property name
    if (compatibleIdentifiers(id, value.id)) {
      return new ExportNamedDeclaration({
        declaration: functionExpressionToDeclaration(value, id)
      });
    }
  }
  else if (value.type === 'ClassExpression') {
    // Exclude classes with different name than the assigned property name
    if (compatibleIdentifiers(id, value.id)) {
      return new ExportNamedDeclaration({
        declaration: classExpressionToDeclaration(value, id)
      });
    }
  }
  else if (value.type === 'Identifier') {
    return new ExportNamedDeclaration({
      specifiers: [
        {
          type: 'ExportSpecifier',
          exported: id,
          local: value
        }
      ]
    });
  }
  else {
    return new ExportNamedDeclaration({
      declaration: new VariableDeclaration('var', [
        {
          type: 'VariableDeclarator',
          id: id,
          init: value
        }
      ])
    });
  }
}

// True when one of the identifiers is null or their names are equal.
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

function classExpressionToDeclaration(cls, id) {
  cls.type = 'ClassDeclaration';
  cls.id = id;
  return cls;
}
