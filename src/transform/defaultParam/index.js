import {matches} from 'f-matches';
import {flow, flatMap, some} from 'lodash/fp';
import {extractVariables} from '../../utils/destructuring';
import traverser from '../../traverser';
import multiReplaceStatement from '../../utils/multiReplaceStatement';
import {isFunction} from '../../utils/functionType';
import matchOrAssignment from './matchOrAssignment';
import matchTernaryAssignment from './matchTernaryAssignment';
import matchIfUndefinedAssignment from './matchIfUndefinedAssignment';

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isFunction(node) && node.body.type === 'BlockStatement') {
        transformDefaultParams(node);
      }
    }
  });
}

function transformDefaultParams(fn) {
  const detectedDefaults = findDefaults(fn.body.body);

  fn.params = fn.params.map((param, i) => {
    // Ignore params that use destructoring or already have a default
    if (param.type !== 'Identifier') {
      return param;
    }

    const detected = detectedDefaults[param.name];
    // Transform when default value detected
    // and default does not contain this or any of the remaining parameters
    if (detected && !containsParams(detected.value, remainingParams(fn, i))) {
      multiReplaceStatement({
        parent: fn.body,
        node: detected.node,
        replacements: []
      });
      return withDefault(param, detected.value);
    }

    return param;
  });
}

function withDefault(param, value) {
  return {
    type: 'AssignmentPattern',
    left: param,
    right: value,
  };
}

function remainingParams(fn, i) {
  return fn.params.slice(i);
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
