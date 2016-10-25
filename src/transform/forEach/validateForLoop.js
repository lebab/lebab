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
export default function validateForLoop(node, {body, indexKind, itemKind}) {
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
  return traverser.find(body, 'ReturnStatement');
}

function breakWithLabelUsed(body) {
  return traverser.find(body, ({type, label}) => type === 'BreakStatement' && label);
}

function continueWithLabelUsed(body) {
  return traverser.find(body, ({type, label}) => type === 'ContinueStatement' && label);
}

function breakUsed(body) {
  return traverser.find(body, 'BreakStatement', {skipTypes: [...loopStatements, 'SwitchStatement']});
}

function continueUsed(body) {
  return traverser.find(body, 'ContinueStatement', {skipTypes: loopStatements});
}
