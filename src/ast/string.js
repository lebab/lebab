var acorn = require('acorn'),
    fs = require('fs');

/**
 * This function reads a js string and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param js
 * @returns {Object}
 */
module.exports = function (js, options) {

    return acorn(js, options);

};