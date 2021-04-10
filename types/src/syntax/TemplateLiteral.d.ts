/**
 * The class to define the TemplateLiteral syntax
 */
export default class TemplateLiteral extends BaseSyntax {
    /**
     * Create a template literal
     * @param {Object[]} quasis String parts
     * @param {Object[]} expressions Expressions between string parts
     */
    constructor({ quasis, expressions }: any[]);
    quasis: any;
    expressions: any;
}
import BaseSyntax from "./BaseSyntax";
