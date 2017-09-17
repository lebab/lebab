import traverser from '../traverser';
import TemplateLiteral from './../syntax/TemplateLiteral';
import TemplateElement from './../syntax/TemplateElement';
import isString from './../utils/isString';
import {sortBy, flatten} from 'lodash/fp';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isPlusExpression(node)) {
        const plusExpr = flattenPlusExpression(node);

        if (plusExpr.isString && !plusExpr.operands.every(isString)) {
          const literal = new TemplateLiteral(splitQuasisAndExpressions(plusExpr.operands));
          // Ensure correct order of comments by sorting them by their position in source
          literal.comments = sortBy('start', plusExpr.comments);
          return literal;
        }
      }
    }
  });
}

// Returns object of three fields:
// - operands: flat array of all the plus operation sub-expressions
// - comments: array of comments
// - isString: true when the result of the whole plus operation is a string
function flattenPlusExpression(node) {
  if (isPlusExpression(node)) {
    const left = flattenPlusExpression(node.left);
    const right = flattenPlusExpression(node.right);

    if (left.isString || right.isString) {
      return {
        operands: flatten([left.operands, right.operands]),
        comments: flatten([
          node.comments || [],
          left.comments,
          right.comments
        ]),
        isString: true,
      };
    }
    else {
      return {
        operands: [node],
        comments: node.comments || [],
        isString: false,
      };
    }
  }
  else {
    return {
      operands: [node],
      comments: node.comments || [],
      isString: isString(node),
    };
  }
}

function isPlusExpression(node) {
  return node.type === 'BinaryExpression' && node.operator === '+';
}

function splitQuasisAndExpressions(operands) {
  const quasis = [];
  const expressions = [];

  for (let i = 0; i < operands.length; i++) {
    const curr = operands[i];

    if (isString(curr)) {
      let currVal = curr.value;
      let currRaw = escapeForTemplate(curr.raw);

      while (isString(operands[i + 1] || {})) {
        i++;
        currVal += operands[i].value;
        currRaw += escapeForTemplate(operands[i].raw);
      }

      quasis.push(new TemplateElement({
        raw: currRaw,
        cooked: currVal
      }));
    }
    else {
      if (i === 0) {
        quasis.push(new TemplateElement({}));
      }

      if (!isString(operands[i + 1] || {})) {
        quasis.push(new TemplateElement({
          tail: operands[i + 1] === undefined
        }));
      }

      expressions.push(curr);
    }
  }

  return {quasis, expressions};
}

// Strip surrounding quotes, escape backticks and unescape escaped quotes
function escapeForTemplate(raw) {
  return raw
    .replace(/^['"]|['"]$/g, '')
    .replace(/`/g, '\\`')
    .replace(/\\(['"])/g, '$1');
}
