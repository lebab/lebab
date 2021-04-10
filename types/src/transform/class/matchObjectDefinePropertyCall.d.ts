/**
 * Matches: Object.defineProperty(<className>.prototype, "<methodName>", {
 *              <kind>: <methodNode>,
 *              ...
 *          })
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - methodName
 * - descriptors:
 *     - propertyNode
 *     - methodNode
 *     - kind
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function _default(node: any): any;
