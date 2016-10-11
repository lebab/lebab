import _ from 'lodash';
import traverser from '../../traverser';
import {isFunction, isOrdinaryFunction} from '../../utils/functionType';
import PotentialRestFunction from './PotentialRestFunction';
import {analyze} from 'escope';

export default function(ast) {
  // Here we track the current function scope.
  // Pushing when entering a function, and popping when exiting.
  const functions = [];

  const scopeManager = analyze(ast, {ecmaVersion: 6});
  let currentScope = scopeManager.acquire(ast);

  traverser.replace(ast, {
    enter(node) {
      if (isFunction(node)) {
        currentScope = scopeManager.acquire(node);
        if (isOrdinaryFunction(node)) {
          functions.push(new PotentialRestFunction(node));
        }
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
      if (isFunction(node)) {
        currentScope = scopeManager.upper;
        if (isOrdinaryFunction(node)) {
          const currentFn = functions.pop();
          node.params = currentFn.getParams();
          currentFn.getTransformableArgumentsNodes().forEach(argumentsNode => {
            argumentsNode.name = 'args';
          });
        }
      }
    }
  });
}

function isArguments(node) {
  return node.type === 'Identifier' && node.name === 'arguments';
}
