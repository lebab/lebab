var acorn = require('acorn'),
    fs = require('fs');

/**
 * This function reads a js file and transforms it into AST
 *
 * @author Mohamad Mohebifar
 * @param file
 * @param options
 * @returns {Object}
 */
module.exports = function (file, options) {

    if (options.sync) {
        var js = fs.readFileSync(file);
        var ast = acorn.parse(js, options);
        return ast;
    } else {
        fs.readFile(function (js) {
            var ast = acorn.parse(js, options);

            if (options.callback) {
                options.callback(ast);
            }
        });
    }

};