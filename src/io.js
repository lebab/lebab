import fs from 'fs';

/**
 * Input/output helpers.
 */
export default {
    read(filename) {
      return fs.readFileSync(filename).toString();
    },

    write(filename, data) {
      fs.writeFileSync(filename, data);
    }
};
