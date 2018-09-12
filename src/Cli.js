import glob from 'glob';
import OptionParser from './OptionParser';
import createTransformer from './createTransformer';
import io from './io';

/**
 * Lebab command line app
 */
export default class Cli {
  /**
   * @param {String[]} argv Command line arguments
   */
  constructor(argv) {
    try {
      this.options = new OptionParser().parse(argv);
      this.transformer = createTransformer(this.options.transforms);
    }
    catch (error) {
      console.error(error); // eslint-disable-line no-console
      process.exit(2);
    }
  }

  /**
   * Runs the app
   */
  run() {
    if (this.options.replace) {
      // Transform all files in a directory
      glob.sync(this.options.replace).forEach((file) => {
        this.transformFile(file, file);
      });
    }
    else {
      // Transform just a single file
      this.transformFile(this.options.inFile, this.options.outFile);
    }
  }

  transformFile(inFile, outFile) {
    const {code, warnings} = this.transformer.run(io.read(inFile));

    // Log warnings if there are any
    if (warnings.length > 0 && inFile) {
      console.error(`${inFile}:`); // eslint-disable-line no-console
    }

    warnings.forEach(({line, msg, type}) => {
      console.error( // eslint-disable-line no-console
        `${line}:  warning  ${msg}  (${type})`
      );
    });

    io.write(outFile, code);
  }
}
