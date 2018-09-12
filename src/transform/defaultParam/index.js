import {matches} from 'f-matches';
import traverser from '../../traverser';
import multiReplaceStatement from '../../utils/multiReplaceStatement';
import matchOrAssignment from './matchOrAssignment';
import matchTernaryAssignment from './matchTernaryAssignment';
import matchIfUndefinedAssignment from './matchIfUndefinedAssignment';

export default function(ast) {
  traverser.replace(ast, {
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
    // and default does not contain this or any of the remaining parameters
    if (detected && (!fn.defaults || !fn.defaults[i]) && !containsParams(detected.value, fn.params.slice(i))) {
      fn.defaults = fn.defaults || [];
      fn.defaults[i] = detected.value;
      multiReplaceStatement({
        parent: fn.body,
        node: detected.node,
        replacements: []
      });
    }
  });
}

function containsParams(defaultValue, params) {
  return params
    .filter(param => param.type === 'Identifier')
    .some(param => traverser.find(defaultValue, matches({
      type: 'Identifier',
      name: param.name,
    })));
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
