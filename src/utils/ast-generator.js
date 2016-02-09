import recast from 'recast';

/**
 * This function reads a js string and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param js
 * @returns {Object}
 */
export function read(js) {

  return recast.parse(js).program;

}

export default {
  read: read,
};
