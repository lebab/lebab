import _ from 'lodash';
import traverser from '../../traverser';
import {isOrdinaryFunction} from '../../utils/functionType';
import withScope from '../../withScope';

export default function(ast) {
  traverser.replace(ast, withScope(ast, {
    enter(node, parent, currentScope) {
      if (isOrdinaryFunction(node) && node.params.length === 0) {
        const argumentsVar = _.find(currentScope.variables, v => v.name === 'arguments');
        // Look through all the places where arguments is used:
        // Make sure none of these has access to some already existing `args` variable
        if (argumentsVar && !argumentsVar.references.some(ref => hasArgs(ref.from))) {
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
