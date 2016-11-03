import {analyze} from 'escope';
import {isFunction} from './utils/functionType';
const emptyFn = () => {}; // eslint-disable-line no-empty-function

/**
 * A helper for traversing with scope info from escope.
 *
 * Usage:
 *
 *     traverser.traverse(ast, withScope(ast, {
 *       enter(node, parent, scope) {
 *         // do something with node and scope
 *       }
 *     }))
 *
 * @param {Object} ast The AST root node also passed to traverser.
 * @param {Object} cfg Object with enter/leave function as expected by traverser.
 * @return {Object} Object with enter/leave functions to be passed to traverser.
 */
export default function withScope(ast, {enter = emptyFn, leave = emptyFn}) {
  const scopeManager = analyze(ast, {ecmaVersion: 6, sourceType: 'module'});
  let currentScope = scopeManager.acquire(ast);

  return {
    enter(node, parent) {
      if (isFunction(node)) {
        currentScope = scopeManager.acquire(node);
      }
      return enter.call(this, node, parent, currentScope);
    },
    leave(node, parent) {
      if (isFunction(node)) {
        currentScope = scopeManager.upper;
      }
      return leave.call(this, node, parent, currentScope);
    }
  };
}
