import traverser from '../../traverser';
import matchDefaultExport from './matchDefaultExport';
import matchNamedExport from './matchNamedExport';
import {isFunctionExpression} from '../../utils/functionType';
import ExportNamedDeclaration from '../../syntax/ExportNamedDeclaration';
import VariableDeclaration from '../../syntax/VariableDeclaration';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node, parent) {
      let m;
      if ((m = matchDefaultExport(node))) {
        if (parent.type !== 'Program') {
          logger.warn(node, 'export can only be at root level', 'commonjs');
          return;
        }
        return exportDefault(m, node.comments);
      }
      else if ((m = matchNamedExport(node))) {
        if (parent.type !== 'Program') {
          logger.warn(node, 'export can only be at root level', 'commonjs');
          return;
        }
        return exportNamed(m, node.comments);
      }
    }
  });
}

function exportDefault({value}, comments) {
  return {
    type: 'ExportDefaultDeclaration',
    declaration: value,
    comments,
  };
}

function exportNamed({id, value}, comments) {
  if (isFunctionExpression(value)) {
    // Exclude functions with different name than the assigned property name
    if (compatibleIdentifiers(id, value.id)) {
      return new ExportNamedDeclaration({
        declaration: functionExpressionToDeclaration(value, id),
        comments,
      });
    }
  }
  else if (value.type === 'ClassExpression') {
    // Exclude classes with different name than the assigned property name
    if (compatibleIdentifiers(id, value.id)) {
      return new ExportNamedDeclaration({
        declaration: classExpressionToDeclaration(value, id),
        comments,
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
      ],
      comments,
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
      ]),
      comments,
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
