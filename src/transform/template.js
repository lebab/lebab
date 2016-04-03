import estraverse from 'estraverse';
import TemplateLiteral from './../syntax/template-literal';
import TemplateElement from './../syntax/template-element';
import isString from './../utils/is-string';
import _ from 'lodash';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (isPlusExpression(node)) {
        const operands = detectOperands(node);

        if (operands.some(isString)) {
          this.skip();
          return new TemplateLiteral(splitQuasisAndExpressions(operands));
        }
      }
    }
  });
}

function detectOperands(node) {
  if (isPlusExpression(node)) {
    return _.flatten([
      detectOperands(node.left),
      detectOperands(node.right)
    ]);
  }
  else {
    return [node];
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
          tail: typeof operands[i + 1] === 'undefined'
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
