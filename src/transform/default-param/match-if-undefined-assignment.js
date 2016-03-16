import {matchesAst, extract} from '../../utils/matches-ast';

const matchEqualsUndefined = matchesAst({
  type: 'BinaryExpression',
  left: {
    type: 'Identifier',
    name: extract('name2')
  },
  operator: extract('operator'),
  right: {
    type: 'Identifier',
    name: 'undefined'
  }
});

const matchTypeofUndefined = matchesAst({
  type: 'BinaryExpression',
  left: {
    type: 'UnaryExpression',
    operator: 'typeof',
    prefix: true,
    argument: {
      type: 'Identifier',
      name: extract('name2')
    }
  },
  operator: extract('operator'),
  right: {
    type: 'Literal',
    value: 'undefined'
  }
});

const matchIfUndefinedAssignment = matchesAst({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      name: extract('name')
    },
    operator: '=',
    right: {
      type: 'ConditionalExpression',
      test: (ast) => matchEqualsUndefined(ast) || matchTypeofUndefined(ast),
      consequent: extract('consequent'),
      alternate: extract('alternate')
    }
  }
});

function isEquals(operator) {
  return operator === '===' || operator === '==';
}

function isNotEquals(operator) {
  return operator === '!==' || operator === '!=';
}

function isIdent(node, name) {
  return node.type === 'Identifier' && node.name === name;
}

/**
 * Matches: <name> = <name> === undefined ? <value> : <name>;
 * Matches: <name> = typeof <name> === 'undefined' ? <value> : <name>;
 *
 * When node matches returns the extracted fields:
 *
 * - name
 * - value
 * - node (the entire node)
 *
 * @param {Object} node
 * @return {Object}
 */
export default function(node) {
  const {name, name2, operator, consequent, alternate} = matchIfUndefinedAssignment(node) || {};

  if (name && name === name2) {
    if (isEquals(operator) && isIdent(alternate, name)) {
      return {name, value: consequent, node};
    }
    if (isNotEquals(operator) && isIdent(consequent, name)) {
      return {name, value: alternate, node};
    }
  }
}
