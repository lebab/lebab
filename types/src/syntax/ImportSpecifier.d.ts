/**
 * The class to define the ImportSpecifier syntax
 */
export default class ImportSpecifier extends BaseSyntax {
    /**
     * @param {Object} cfg
     * @param {Identifier} cfg.local  The local variable
     * @param {Identifier} cfg.imported  The imported variable
     */
    constructor({ local, imported }: {
        local: any;
        imported: any;
    });
    local: any;
    imported: any;
}
import BaseSyntax from "./BaseSyntax";
