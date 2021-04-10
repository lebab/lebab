/**
 * The class to define the ArrowFunctionExpression syntax
 */
export default class ArrowFunctionExpression extends BaseSyntax {
    /**
     * The constructor of ArrowFunctionExpression
     *
     * @param {Object} cfg
     * @param {Node} cfg.body
     * @param {Node[]} cfg.params
     * @param {Node[]} cfg.defaults
     * @param {Node} cfg.rest (optional)
     */
    constructor({ body, params, defaults, rest, async }: {
        body: Node;
        params: Node[];
        defaults: Node[];
        rest: Node;
    });
    body: Node;
    params: Node[];
    defaults: Node[];
    rest: Node;
    async: any;
    generator: boolean;
    id: any;
}
import BaseSyntax from "./BaseSyntax";
