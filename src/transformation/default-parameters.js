import _ from 'lodash';
import estraverse from 'estraverse';
import multiReplaceStatement from '../utils/multi-replace-statement.js';

// Matches: <ident> = <ident> || ...;
const isDefaultAssignment = _.matches({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    left: {
      type: 'Identifier',
      // name: <ident>
    },
    operator: '=',
    right: {
      type: 'LogicalExpression',
      left: {
        type: 'Identifier',
        // name: <ident>
      },
      operator: '||',
      right: {
        // ...
      }
    }
  }
});

function matchesDefaultAssignment(node) {
  if (isDefaultAssignment(node)) {
    const {
      expression: {
        left: {name: name},
        right: {
          left: {name: nameAgain},
          right: value
        }
      }
    } = node;

    if (name === nameAgain) {
      return {name, value, node};
    }
  }
}

export default function (ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        const detectedDefaults = findDefaults(node.body.body);
        node.params.forEach((param, i) => {
          const def = detectedDefaults[param.name];
          if (!node.defaults[i] && param.type === 'Identifier' && def) {
            node.defaults[i] = def.value;
            multiReplaceStatement(node.body, def.node, []);
          }
        });
      }
    }
  });
}

function findDefaults(fnBody) {
  const defaults = {};

  for (const node of fnBody) {
    const def = matchesDefaultAssignment(node);
    if (!def) {
      break;
    }
    defaults[def.name] = def;
  }

  return defaults;
}
