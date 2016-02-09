import fs from 'fs';

/**
 * Input/output helpers.
 */
export default {
  /**
   * Returns the contents of an entire file.
   * When no filename given, reads from STDIN.
   * @param  {String} filename
   * @return {String}
   */
  read(filename) {
    if (filename) {
      return fs.readFileSync(filename).toString();
    }
    else {
      // NOTE: This does not work in Windows.
      // Haven't managed to figure out how to read STDIN
      // in proper cross-platform way.
      return fs.readFileSync('/dev/stdin').toString();
    }
  },

  /**
   * Writes the data to file.
   * When no filename given, writes to STDIN.
   * @param  {String} filename
   * @param  {String} data
   */
  write(filename, data) {
    if (filename) {
      fs.writeFileSync(filename, data);
    }
    else {
      process.stdout.write(data);
    }
  }
};
