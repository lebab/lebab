/**
 * Passed to transforms so they can log warnings.
 */
export default class Logger {
    warnings: any[];
    /**
     * Logs a warning.
     * @param  {Object} node AAST node that caused the warning
     * @param  {String} msg Warning message itself
     * @param  {String} type Name of the transform
     */
    warn(node: any, msg: string, type: string): void;
    /**
     * Returns list of all the warnings
     * @return {Object[]}
     */
    getWarnings(): any[];
}
