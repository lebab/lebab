import _ from 'lodash';
import traverser from '../../traverser';
import {isOrdinaryFunction} from '../../utils/functionType';
import PotentialRestFunction from './PotentialRestFunction';
import withScope from '../../withScope';

export default function(ast) {
  // Here we track the current function scope.
  // Pushing when entering a function, and popping when exiting.
  const functions = [];

  traverser.replace(ast, withScope(ast, {
    enter(node, parent, currentScope) {
      if (isOrdinaryFunction(node)) {
        functions.push(new PotentialRestFunction(node));
      }
      else if (isArguments(node)) {
        const currentFn = _.last(functions);
        if (currentFn && !currentFn.hasParams()) {
          currentFn.addArgumentsNode(node);
          if (currentScope.variables.some(v => v.name === 'args')) {
            currentFn.markConflicting();
          }
        }
      }
    },
    leave(node) {
      if (isOrdinaryFunction(node)) {
        const currentFn = functions.pop();
        node.params = currentFn.getParams();
        currentFn.getTransformableArgumentsNodes().forEach(argumentsNode => {
          argumentsNode.name = 'args';
        });
      }
    }
  }));
}

function isArguments(node) {
  return node.type === 'Identifier' && node.name === 'arguments';
}
