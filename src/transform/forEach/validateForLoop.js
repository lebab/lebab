import traverser from '../../traverser';

/**
 * Checks that for-loop can be transformed to Array.forEach()
 *
 * Returns a warning message in case we can't transform.
 *
 * @param  {Object} node The ForStatement
 * @param  {Object} body BlockStatement that's body of ForStatement
 * @param  {String} indexKind
 * @param  {String} itemKind
 * @return {Array} Array of node and warnings message or undefined on success.
 */
export function validateForLoop(node, {body, indexKind, itemKind}) {
  let statement;
  if ((statement = returnUsed(body))) {
    return [statement, 'Return statement used in for-loop body'];
  }
  else if ((statement = breakWithLabelUsed(body))) {
    return [statement, 'Break statement with label used in for-loop body'];
  }
  else if ((statement = continueWithLabelUsed(body))) {
    return [statement, 'Continue statement with label used in for-loop body'];
  }
  else if ((statement = breakUsed(body))) {
    return [statement, 'Break statement used in for-loop body'];
  }
  else if ((statement = continueUsed(body))) {
    return [statement, 'Continue statement used in for-loop body'];
  }
  else if (indexKind !== 'let') {
    return [node, 'Only for-loops with indexes declared as let can be tranformed (use let transform first)'];
  }
  else if (itemKind !== 'const') {
    return [node, 'Only for-loops with const array items can be tranformed (use let transform first)'];
  }
}

const loopStatements = ['ForStatement', 'ForInStatement', 'ForOfStatement', 'DoWhileStatement', 'WhileStatement'];

function returnUsed(body) {
  return statementUsedInBody(body, statement => statement.type === 'ReturnStatement', []);
}

function breakWithLabelUsed(body) {
  return statementUsedInBody(body, statement => statement.type === 'BreakStatement' && statement.label, []);
}

function continueWithLabelUsed(body) {
  return statementUsedInBody(body, statement => statement.type === 'ContinueStatement' && statement.label, []);
}

function breakUsed(body) {
  return statementUsedInBody(body, statement => statement.type === 'BreakStatement', [...loopStatements, 'SwitchStatement']);
}

function continueUsed(body) {
  return statementUsedInBody(body, statement => statement.type === 'ContinueStatement', loopStatements);
}

// Find if a statement is used in the for loop body,
// skipping certain types of nodes such as nested for loops or switch statements
// Returns the line of the statement (if found);
function statementUsedInBody(body, statementPredicate, skippedTypes) {
  let statement;

  traverser.traverse(body, {
    enter(node) {
      if (skippedTypes.includes(node.type)) {
        return traverser.VisitorOption.Skip;
      }
      if (statementPredicate(node)) {
        statement = node;
        return traverser.VisitorOption.Break;
      }
    }
  });

  return statement;
}
