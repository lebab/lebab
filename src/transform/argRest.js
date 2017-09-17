import {find} from 'lodash/fp';
import traverser from '../traverser';
import withScope from '../withScope';

export default function(ast) {
  traverser.replace(ast, withScope(ast, {
    enter(node, parent, scope) {
      if (isES5Function(node) && node.params.length === 0) {
        const argumentsVar = find(v => v.name === 'arguments', scope.variables);
        // Look through all the places where arguments is used:
        // Make sure none of these has access to some already existing `args` variable
        if (
          argumentsVar &&
          argumentsVar.references.length > 0 &&
          !argumentsVar.references.some(ref => hasArgs(ref.from))
        ) {
          // Change all arguments --> args
          argumentsVar.references.forEach(ref => {
            ref.identifier.name = 'args';
          });
          // Change function() --> function(...args)
          node.params = [createRestElement()];
        }
      }
    },
  }));
}

function isES5Function(node) {
  return node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression';
}

function hasArgs(scope) {
  if (!scope) {
    return false;
  }
  if (scope.variables.some(v => v.name === 'args')) {
    return true;
  }
  return hasArgs(scope.upper);
}

function createRestElement() {
  return {
    type: 'RestElement',
    argument: {
      type: 'Identifier',
      name: 'args'
    }
  };
}
