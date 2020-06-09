import type { TypedArray } from "tractjs-core";
/**
 * A Tensor. The standard input and output type.
 *
 * Defined by a [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and a shape.
 *
 * Data is stored in standard order i. e. `new Tensor(new Float32Array([1, 2, 3, 4]), [2, 2])` is comparable to `[[1, 2], [3, 4]]`.
 */
export declare class Tensor {
    data: TypedArray;
    shape: number[];
    constructor(data: TypedArray, shape: number[]);
}
