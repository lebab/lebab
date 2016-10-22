import _ from 'lodash';
import traverser from '../../traverser';
import isEqualAst from '../../utils/isEqualAst';
import {isReference} from '../../utils/variableType';
import copyComments from '../../utils/copyComments';
import matchAliasedForLoop from '../../utils/matchAliasedForLoop';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchAliasedForLoop(node);

      if (matches) {
        const warning = validateForLoop(node, matches);
        if (warning) {
          logger.warn(...warning, 'for-each');
          return;
        }

        return withComments(node, createForEach(matches));
      }

      if (node.type === 'ForStatement') {
        logger.warn(node, 'Unable to transform for loop', 'for-each');
      }
    }
  });
}

function validateForLoop(node, {body, indexKind, itemKind}) {
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

function withComments(node, forEach) {
  copyComments({from: node, to: forEach});
  copyComments({from: node.body.body[0], to: forEach});
  return forEach;
}

function createForEach({body, item, index, array}) {
  const newBody = removeFirstBodyElement(body);
  const params = createForEachParams(newBody, item, index);
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: array,
        property: {
          type: 'Identifier',
          name: 'forEach'
        }
      },
      arguments: [{
        type: 'ArrowFunctionExpression',
        params,
        body: newBody
      }]
    }
  };
}

function removeFirstBodyElement(body) {
  return Object.assign({}, body, {
    body: _.tail(body.body)
  });
}

function createForEachParams(newBody, item, index) {
  if (indexUsedInBody(newBody, index)) {
    return [item, index];
  }
  return [item];
}

function indexUsedInBody(newBody, index) {
  return traverser.find(newBody, (node, parent) => {
    return isEqualAst(node, index) && isReference(node, parent);
  });
}
