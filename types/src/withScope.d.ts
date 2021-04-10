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
 * @param {Object} cfg Object with enter function as expected by traverser.
 * @return {Object} Object with enter function to be passed to traverser.
 */
export default function withScope(ast: any, { enter }: any): any;
