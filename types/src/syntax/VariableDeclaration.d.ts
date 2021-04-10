/**
 * The class to define the VariableDeclaration syntax
 */
export default class VariableDeclaration extends BaseSyntax {
    /**
     * The constructor of VariableDeclaration
     *
     * @param {String} kind
     * @param {VariableDeclarator[]} declarations
     */
    constructor(kind: string, declarations: any[]);
    kind: string;
    declarations: any[];
}
import BaseSyntax from "./BaseSyntax";
