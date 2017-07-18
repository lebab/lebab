/**
 * Passed to transforms so they can log warnings.
 */
export default class Logger {
  constructor() {
    this.warnings = [];
  }

  /**
   * Logs a warning.
   * @param  {Object} node AAST node that caused the warning
   * @param  {String} msg Warning message itself
   * @param  {String} type Name of the transform
   */
  warn(node, msg, type) {
    this.warnings.push({
      line: node.loc ? node.loc.start.line : 0,
      msg,
      type,
    });
  }

  /**
   * Returns list of all the warnings
   * @return {Object[]}
   */
  getWarnings() {
    return this.warnings;
  }
}
