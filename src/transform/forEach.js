import _ from 'lodash';
import traverser from '../traverser';
import isEqualAst from '../utils/isEqualAst';
import {isReference} from '../utils/variableType';
import {isFunction} from '../utils/functionType';
import copyComments from '../utils/copyComments';
import matchAliasedForLoop from '../utils/matchAliasedForLoop';

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const matches = matchAliasedForLoop(node);

      if (matches) {
        let statement;
        const {body} = matches;
        if ((statement = returnUsed(body))) {
          logger.warn(statement, 'Return statement used in for-loop body', 'for-each');
          return;
        }
        else if ((statement = functionUsed(body))) {
          logger.warn(statement, 'Function defined in for-loop body', 'for-each');
          return;
        }
        else if ((statement = breakWithLabelUsed(body))) {
          logger.warn(statement, 'Break statement with label used in for-loop body', 'for-each');
          return;
        }
        else if ((statement = continueWithLabelUsed(body))) {
          logger.warn(statement, 'Continue statement with label used in for-loop body', 'for-each');
          return;
        }
        else if ((statement = breakUsed(body))) {
          logger.warn(statement, 'Break statement used in for-loop body', 'for-each');
          return;
        }
        else if ((statement = continueUsed(body))) {
          logger.warn(statement, 'Continue statement used in for-loop body', 'for-each');
          return;
        }
        else if (matches.indexKind !== 'let') {
          logger.warn(node, 'Only for-loops with indexes declared as let can be tranformed (use let transform first)', 'for-each');
          return;
        }
        else if (matches.itemKind !== 'const') {
          logger.warn(node, 'Only for-loops with const array items can be tranformed (use let transform first)', 'for-each');
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

const loopStatements = ['ForStatement', 'ForInStatement', 'ForOfStatement', 'DoWhileStatement', 'WhileStatement'];

function returnUsed(body) {
  return statementUsedInBody(body, statement => statement.type === 'ReturnStatement', []);
}

function functionUsed(body) {
  return statementUsedInBody(body, statement => isFunction(statement), []);
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
      if (skippedTypes.indexOf(node.type) !== -1) {
        this.skip();
      }
      if (statementPredicate(node)) {
        statement = node;
        this.break();
      }
    }
  });

  return statement;
}

function indexUsedInBody(newBody, index) {
  return traverser.find(newBody, (node, parent) => {
    return isEqualAst(node, index) && isReference(node, parent);
  });
}

function withComments(node, forEach) {
  copyComments({from: node, to: forEach});
  copyComments({from: node.body.body[0], to: forEach});
  return forEach;
}

function createForEachParams(newBody, item, index) {
  if (indexUsedInBody(newBody, index)) {
    return [item, index];
  }
  return [item];
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
