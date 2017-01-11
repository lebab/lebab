import glob from 'glob';
import path from 'path';
import parseOptions from './parseOptions';
import builtinTransforms from './builtinTransforms';
import io from './io';

const originalPrefix = '_original.';
/**
 * Lebab command line app
 */
export default class Cli {
  /**
   * @param {String[]} argv Command line arguments
   */
  constructor(argv) {
    try {
      this.options = parseOptions(argv);
    }
    catch (error) {
      console.error(error); // eslint-disable-line no-console
      process.exit(2);
    }

    if (this.options.transforms) {
      this.transformer = builtinTransforms.createTransformer(this.options.transforms);
    }
  }

  /**
   * Runs the app
   */
  run() {
    if (this.options.deleteOriginals) {
      const deletePath = path.join(this.options.deleteOriginals, `${originalPrefix}*`);
      // I couldn't get glob.sync to ignore node_modules.
      glob(deletePath, {
        ignore: ['**/node_modules/**'],
        nodir: true,
        nosort: true
      }, (err, files) => {
        if (err) {
          console.log('globe error', err); // eslint-disable-line no-console
        }
        files.forEach((file) => {
          console.log(`Deleting ${file}`); // eslint-disable-line no-console
          io.unlink(file);
        });
      });
    }
    else if (this.options.replaceSaveOriginal) {
      // I couldn't get glob.sync to ignore node_modules.
      glob(this.options.replaceSaveOriginal, {
        ignore: ['**/node_modules/**', `**/${originalPrefix}*`],
        nodir: true,
        nosort: true
      }, (err, files) => {
        if (err) {
          console.log('globe error', err); // eslint-disable-line no-console
        }
        files.forEach((file) => {
          if (file.indexOf('/node_modules/') >= 0 || file.indexOf(originalPrefix) >= 0) {
            return;
          }
          this.transformFile(file, file);
        });
      });
    }
    else if (this.options.replace) {
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

  prefixFileName(fullPath, prefix) {
    const parts = path.parse(fullPath);
    let dir = parts.dir;
    if (dir) {
      dir = `${dir}/`;
    }
    const name = `${prefix}${parts.name}`;
    const newFileName = `${dir}${name}${parts.ext}`;
    return newFileName;
  }

  transformFile(inFile, outFile) {
    try {
      const inFileText = io.read(inFile);
      const {code, warnings} = this.transformer.run(inFileText);

      // Log warnings if there are any
      if (warnings.length > 0 && inFile) {
        console.error(`${inFile}:`); // eslint-disable-line no-console
      }

      warnings.forEach(({line, msg, type}) => {
        console.error( // eslint-disable-line no-console
          `${inFile} ${line}:  warning  ${msg}  (${type})`
        );
      });

      // only write if something changed.  speed improvement
      if (inFileText !== outFile) {
        if (this.options.replaceSaveOriginal) {
          const originalInFile = this.prefixFileName(inFile, originalPrefix);
          io.write(originalInFile, inFileText);
          console.log(`${inFile} copied to ${originalInFile} and tranformed to ES6 in ${outFile}`); // eslint-disable-line no-console
        }
        io.write(outFile, code);
      }
    }
    catch (error) {
      // gracefully handle parse errors
      console.error(`Error in ${inFile} line:${error.lineNumber}:${error.column} message: ${error.message}`); // eslint-disable-line no-console
    }
  }
}
