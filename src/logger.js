/**
 * Passed to transforms so they can log warnings.
 */
export default class Logger {
  constructor() {
    this.warnings = [];
  }

  /**
   * Logs a warning.
   * @param  {String} warning
   */
  warn(warning) {
    this.warnings.push(warning);
  }

  /**
   * Returns list of all the warnings
   * @return {String[]}
   */
  getWarnings() {
    return this.warnings;
  }
}
