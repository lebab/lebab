/**
 * Command line options parser.
 */
export default class OptionParser {
    program: import("commander").Command;
    /**
     * Parses and validates command line options from argv.
     *
     * - On success returns object with options.
     * - On failure throws exceptions with error message to be shown to user.
     *
     * @param {String[]} argv Raw command line arguments
     * @return {Object} options object
     */
    parse(argv: string[]): any;
    getInputFile(): string;
    getReplace(): any;
    getTransforms(): any;
}
