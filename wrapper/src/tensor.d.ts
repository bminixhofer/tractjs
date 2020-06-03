import type { TypedArray } from "tract-js-core";
export declare class Tensor {
    data: TypedArray;
    shape: number[];
    constructor(data: TypedArray, shape: number[]);
}
