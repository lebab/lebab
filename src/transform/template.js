import traverser from '../traverser';
import TemplateLiteral from './../syntax/TemplateLiteral';
import TemplateElement from './../syntax/TemplateElement';
import isString from './../utils/isString';
import _ from 'lodash';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isPlusExpression(node)) {
        const [operands, isStringConcatenation] = flattenPlusExpression(node);

        if (isStringConcatenation && !operands.every(isString)) {
          const literal = new TemplateLiteral(splitQuasisAndExpressions(operands));
          literal.comments = operands.comments;
          return literal;
        }
      }
    }
  });
}

// Returns two items:
// - flat array of all the plus operation sub-expressions
// - true when the result of the plus operation is a string
function flattenPlusExpression(node) {
  if (isPlusExpression(node)) {
    const [left, leftIsString] = flattenPlusExpression(node.left);
    const [right, rightIsString] = flattenPlusExpression(node.right);

    if (leftIsString || rightIsString) {
      const operands = _.flatten([left, right]);
      operands.comments = node.comments;
      return [operands, true];
    }
    else {
      return [node, false];
    }
  }
  else {
    return [node, isString(node)];
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
