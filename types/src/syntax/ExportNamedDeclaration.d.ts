/**
 * The class to define the ExportNamedDeclaration syntax.
 */
export default class ExportNamedDeclaration extends BaseSyntax {
    /**
     * Constructed with either declaration or specifiers.
     * @param {Object} cfg
     * @param {Object} cfg.declaration Any *Declaration node (optional)
     * @param {Object[]} cfg.specifiers List of specifiers (optional)
     * @param {Object[]} cfg.comments Comments data (optional)
     */
    constructor({ declaration, specifiers, comments }: {
        declaration: any;
        specifiers: any[];
        comments: any[];
    });
    declaration: any;
    specifiers: any[];
    comments: any[];
}
import BaseSyntax from "./BaseSyntax";
