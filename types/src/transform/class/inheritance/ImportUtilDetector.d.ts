/**
 * Detects variable name imported from: import <name> from "util"
 */
export default class ImportUtilDetector {
    /**
     * Detects: import <identifier> from "util"
     *
     * @param {Object} node
     * @return {Object} MemberExpression of <identifier>.inherits
     */
    detect(node: any): any;
    matchImportUtil(node: any): any;
}
