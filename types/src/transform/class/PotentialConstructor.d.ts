/**
 * Represents a potential constructor method to be created.
 */
export default class PotentialConstructor extends PotentialMethod {
    constructor(cfg: any);
    isSuperConstructorCall(node: any, ...args: any[]): any;
}
import PotentialMethod from "./PotentialMethod";
