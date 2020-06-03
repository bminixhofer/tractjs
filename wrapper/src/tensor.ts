import type { TypedArray } from "tract-js-core";

export class Tensor {
    data: TypedArray
    shape: number[]

    constructor(data: TypedArray, shape: number[]) {
        this.data = data;
        this.shape = shape;
    }
}
