/**
 * Detects variable name imported from require("util").inherits
 */
export default class RequireUtilInheritsDetector {
    /**
     * Detects: var <identifier> = require("util").inherits
     *
     * @param {Object} node
     * @return {Object} Identifier
     */
    detect(node: any): any;
    isRequireUtilInherits(dec: any, ...args: any[]): any;
}
