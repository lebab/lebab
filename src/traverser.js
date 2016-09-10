import _ from 'lodash';
import estraverse from 'estraverse';

// JSX AST types, as documented in:
// https://github.com/facebook/jsx/blob/master/AST.md
const jsxExtensionKeys = {
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
};

const experimentalExtensionKeys = {
  ExperimentalRestProperty: ['argument'],
  ExperimentalSpreadProperty: ['argument'],
};

const extensions = {
  keys: _.assign({}, jsxExtensionKeys, experimentalExtensionKeys),
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
    return estraverse.traverse(tree, _.assign(cfg, extensions));
  },

  /**
   * Traverses AST like ESTraverse.replace()
   * @param  {Object} tree
   * @param  {Object} cfg Object with optional enter() and leave() methods.
   * @return {Object} The transformed tree
   */
  replace(tree, cfg) {
    return estraverse.replace(tree, _.assign(cfg, extensions));
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
   * @param  {Function} predicate Called with `node` and `parent`
   * @return {Object} The found node or undefined when not found
   */
  find(tree, predicate) {
    let found;

    this.traverse(tree, {
      enter(node, parent) {
        if (predicate(node, parent)) {
          found = node;
          return estraverse.VisitorOption.Break;
        }
      }
    });

    return found;
  },
};
