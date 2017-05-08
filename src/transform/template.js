import traverser from '../traverser';
import TemplateLiteral from './../syntax/TemplateLiteral';
import TemplateElement from './../syntax/TemplateElement';
import isString from './../utils/isString';
import _ from 'lodash';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isPlusExpression(node)) {
        this.skip();

        const [operands, isStringConcatenation, comments] = flattenPlusExpression(node);

        if (isStringConcatenation && !operands.every(isString)) {
          const literal = new TemplateLiteral(splitQuasisAndExpressions(operands));
          literal.comments = comments;
          return literal;
        }
      }
    }
  });
}

// Returns three items:
// - flat array of all the plus operation sub-expressions
// - true when the result of the plus operation is a string
// - array of comments
function flattenPlusExpression(node) {
  if (isPlusExpression(node)) {
    const [left, leftIsString, leftComments] = flattenPlusExpression(node.left);
    const [right, rightIsString, rightComments] = flattenPlusExpression(node.right);

    if (leftIsString || rightIsString) {
      const operands = _.flatten([left, right]);
      const comments = _.flatten([
        node.comments || [],
        leftComments,
        rightComments
      ]);
      return [operands, true, comments];
    }
    else {
      return [node, false, node.comments || []];
    }
  }
  else {
    return [node, isString(node), node.comments || []];
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
