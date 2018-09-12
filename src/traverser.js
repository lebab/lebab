import {includes, isString} from 'lodash/fp';
import estraverse from 'estraverse';

// JSX AST types, as documented in:
// https://github.com/facebook/jsx/blob/master/AST.md
const jsxExtensionKeys = {
  keys: {
    JSXIdentifier: [],
    JSXMemberExpression: ['object', 'property'],
    JSXNamespacedName: ['namespace', 'name'],
    JSXEmptyExpression: [],
    JSXExpressionContainer: ['expression'],
    JSXOpeningElement: ['name', 'attributes'],
    JSXClosingElement: ['name'],
    JSXAttribute: ['name', 'value'],
    JSXSpreadAttribute: ['argument'],
    JSXElement: ['openingElement', 'closingElement', 'children'],
    JSXText: [],
  }
};

/**
 * Proxy for ESTraverse.
 * Providing a single place to easily extend its functionality.
 *
 * Exposes the traverse() and replace() methods just like ESTraverse,
 * plus some custom helpers.
 */
export default {
  /**
   * Traverses AST like ESTraverse.traverse()
   * @param  {Object} tree
   * @param  {Object} cfg Object with optional enter() and leave() methods.
   * @return {Object} The transformed tree
   */
  traverse(tree, cfg) {
    return estraverse.traverse(tree, Object.assign(cfg, jsxExtensionKeys));
  },

  /**
   * Traverses AST like ESTraverse.replace()
   * @param  {Object} tree
   * @param  {Object} cfg Object with optional enter() and leave() methods.
   * @return {Object} The transformed tree
   */
  replace(tree, cfg) {
    return estraverse.replace(tree, Object.assign(cfg, jsxExtensionKeys));
  },

  /**
   * Constants to return from enter()/leave() to control traversal:
   *
   * - Skip - skips walking child nodes
   * - Break - ends it all
   * - Remove - removes the current node (only with replace())
   */
  VisitorOption: estraverse.VisitorOption,

  /**
   * Searches in AST tree for node which satisfies the predicate.
   * @param  {Object} tree
   * @param  {Function|String} query Search function called with `node` and `parent`
   *   Alternatively it can be string: the node type to search for.
   * @param  {String[]} opts.skipTypes List of node types to skip (not traversing into these nodes)
   * @return {Object} The found node or undefined when not found
   */
  find(tree, query, {skipTypes = []} = {}) {
    const predicate = this.createFindPredicate(query);
    let found;

    this.traverse(tree, {
      enter(node, parent) {
        if (includes(node.type, skipTypes)) {
          return estraverse.VisitorOption.Skip;
        }
        if (predicate(node, parent)) {
          found = node;
          return estraverse.VisitorOption.Break;
        }
      }
    });

    return found;
  },

  createFindPredicate(query) {
    if (isString(query)) {
      return (node) => node.type === query;
    }
    else {
      return query;
    }
  }
};
