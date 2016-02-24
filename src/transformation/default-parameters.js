import estraverse from 'estraverse';
import multiReplaceStatement from '../utils/multi-replace-statement.js';
import matchOrAssignment from '../default-param/match-or-assignment.js';
import matchTernaryAssignment from '../default-param/match-ternary-assignment.js';
import matchEqualsUndefinedAssignment from '../default-param/match-equals-undefined-assignment.js';
import matchTypeofUndefinedAssignment from '../default-param/match-typeof-undefined-assignment.js';

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
    const def = matchDefaultAssignment(node);
    if (!def) {
      break;
    }
    defaults[def.name] = def;
  }

  return defaults;
}

function matchDefaultAssignment(node) {
  return matchOrAssignment(node) ||
    matchTernaryAssignment(node) ||
    matchEqualsUndefinedAssignment(node) ||
    matchTypeofUndefinedAssignment(node);
}
