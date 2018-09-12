import {matches} from 'f-matches';
import {flow, flatMap, some} from 'lodash/fp';
import {extractVariables} from '../../utils/destructuring';
import traverser from '../../traverser';
import multiReplaceStatement from '../../utils/multiReplaceStatement';
import matchOrAssignment from './matchOrAssignment';
import matchTernaryAssignment from './matchTernaryAssignment';
import matchIfUndefinedAssignment from './matchIfUndefinedAssignment';
import Parameter from './Parameter';

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

  fn.params.forEach((p) => {
    const param = new Parameter(fn, p);

    // Ignore destructoring, only work with simple variables
    if (!param.isIdentifier()) {
      return;
    }

    const detected = detectedDefaults[param.name()];
    // Transform when default value detected and no existing default value
    // and default does not contain this or any of the remaining parameters
    if (detected && !param.hasDefault() && !containsParams(detected.value, param.remainingParams())) {
      param.setDefault(detected.value);
      multiReplaceStatement({
        parent: fn.body,
        node: detected.node,
        replacements: []
      });
    }
  });
}

function containsParams(defaultValue, params) {
  return flow(
    flatMap(extractVariables),
    some(param => traverser.find(defaultValue, matches({
      type: 'Identifier',
      name: param.name,
    })))
  )(params);
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
