import {matchRequire, matchRequireWithProperty} from './matchRequire';

/**
 * Matches: var <id> = require(<source>);
 *          var <id> = require(<source>).<property>;
 */
export default function isVarWithRequireCalls(node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.some(dec => matchRequire(dec) || matchRequireWithProperty(dec));
}
