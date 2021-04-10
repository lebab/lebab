/**
 * The class to define the ImportDeclaration syntax
 */
export default class ImportDeclaration extends BaseSyntax {
    /**
     * @param {Object} cfg
     * @param {ImportSpecifier[]|ImportDefaultSpecifier[]} cfg.specifiers
     * @param {Literal} cfg.source String literal containing library path
     */
    constructor({ specifiers, source }: {
        specifiers: any[] | any[];
        source: any;
    });
    specifiers: any[];
    source: any;
}
import BaseSyntax from "./BaseSyntax";
