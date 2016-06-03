import estraverse from 'estraverse';

/**
 * Proxy for ESTraverse.
 * Providing a single place to easily extend its functionality.
 *
 * Exposes the exact same API as ESTraverse.
 */
export default {
  traverse(tree, cfg) {
    return estraverse.traverse(tree, cfg);
  },
  replace(tree, cfg) {
    return estraverse.replace(tree, cfg);
  },
  VisitorOption: estraverse.VisitorOption,
};
