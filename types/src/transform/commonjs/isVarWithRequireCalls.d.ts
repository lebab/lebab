/**
 * Matches: var <id> = require(<source>);
 *          var <id> = require(<source>).<property>;
 */
export default function isVarWithRequireCalls(node: any): any;
