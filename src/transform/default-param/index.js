import estraverse from 'estraverse';
import multiReplaceStatement from '../../utils/multi-replace-statement';
import matchOrAssignment from './match-or-assignment';
import matchTernaryAssignment from './match-ternary-assignment';
import matchIfUndefinedAssignment from './match-if-undefined-assignment';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        transformDefaultParams(node);
      }
    }
  });
}

function transformDefaultParams(fn) {
  const detectedDefaults = findDefaults(fn.body.body);

  fn.params.forEach((param, i) => {
    // Ignore destructoring, only work with simple variables
    if (param.type !== 'Identifier') {
      return;
    }

    const detected = detectedDefaults[param.name];
    // Transform when default value detected and no existing default value
    if (detected && (!fn.defaults || !fn.defaults[i])) {
      fn.defaults = fn.defaults || [];
      fn.defaults[i] = detected.value;
      multiReplaceStatement(fn.body, detected.node, []);
    }
  });
}

// Looks default value assignments at the beginning of a function
//
// Returns a map of variable-name:{name, value, node}
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
    matchIfUndefinedAssignment(node);
}
