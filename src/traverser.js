import estraverse from 'estraverse';

// JSX AST types, as documented in:
// https://github.com/facebook/jsx/blob/master/AST.md
const jsxExtensions = {
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
  }
};

/**
 * Proxy for ESTraverse.
 * Providing a single place to easily extend its functionality.
 *
 * Exposes the exact same API as ESTraverse.
 */
export default {
  traverse(tree, cfg) {
    return estraverse.traverse(tree, Object.assign(cfg, jsxExtensions));
  },
  replace(tree, cfg) {
    return estraverse.replace(tree, Object.assign(cfg, jsxExtensions));
  },
  VisitorOption: estraverse.VisitorOption,
};
