/**
 * Detects variable name imported from require("util")
 */
export default class RequireUtilDetector {
    /**
     * Detects: var <identifier> = require("util")
     *
     * @param {Object} node
     * @return {Object} MemberExpression of <identifier>.inherits
     */
    detect(node: any): any;
    isRequireUtil(dec: any, ...args: any[]): any;
}
