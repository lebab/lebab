/**
 * Runs transforms on code.
 */
export default class Transformer {
    /**
     * @param {Function[]} transforms List of transforms to perform
     */
    constructor(transforms?: Function[]);
    transforms: Function[];
    /**
     * Tranforms code using all configured transforms.
     *
     * @param {String} code Input ES5 code
     * @return {Object} Output ES6 code
     */
    run(code: string): any;
    applyAllTransforms(code: any, logger: any): any;
    ignoringHashBangComment(code: any, callback: any): any;
    detectLineTerminator(code: any): "\r\n" | "\n";
}
