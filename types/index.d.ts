export type transformTypes =
    | "class"
    | "template"
    | "arrow"
    | "arrow-return"
    | "let"
    | "default-param"
    | "destruct-param"
    | "arg-spread"
    | "arg-rest"
    | "obj-method"
    | "obj-shorthand"
    | "no-strict"
    | "commonjs"
    | "exponent"
    | "multi-var"
    | "for-of"
    | "for-each"
    | "includes";

export function transform(code: string, transformNames: transformTypes[]): any;