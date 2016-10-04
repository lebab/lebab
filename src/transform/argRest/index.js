import _ from 'lodash';
import traverser from '../../traverser';
import {isOrdinaryFunction} from '../../utils/functionType';
import PotentialRestFunction from './PotentialRestFunction';

export default function(ast) {
  // Here we track the current function scope.
  // Pushing when entering a function, and popping when exiting.
  const functions = [];

  traverser.replace(ast, {
    enter(node) {
      if (isOrdinaryFunction(node)) {
        functions.push(new PotentialRestFunction(node));
      }
      else if (isArguments(node)) {
        const currentFn = _.last(functions);
        if (currentFn && !currentFn.hasParams()) {
          node.name = 'args';
          currentFn.addRestParam();
        }
      }
    },
    leave(node) {
      if (isOrdinaryFunction(node)) {
        node.params = functions.pop().getParams();
      }
    }
  });
}

function isArguments(node) {
  return node.type === 'Identifier' && node.name === 'arguments';
}
