/**
 * True when two AST nodes are structurally equal.
 * When comparing objects it ignores the meta-data fields for
 * comments and source-code position.
 * @param  {Object}  a
 * @param  {Object}  b
 * @return {Boolean}
 */
export default function isEqualAst(a: any, b: any): boolean;
