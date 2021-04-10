/**
 * True when indexOf() comparison can be translated to includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isIncludesComparison({ operator, index }: any): boolean;
/**
 * True when indexOf() comparison can be translated to !includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isNotIncludesComparison({ operator, index }: any): boolean;
