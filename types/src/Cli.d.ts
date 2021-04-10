/**
 * Lebab command line app
 */
export default class Cli {
    /**
     * @param {String[]} argv Command line arguments
     */
    constructor(argv: string[]);
    options: any;
    transformer: import("./Transformer").default;
    /**
     * Runs the app
     */
    run(): void;
    transformFile(inFile: any, outFile: any): void;
}
