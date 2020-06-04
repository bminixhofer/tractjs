import type { TypedArray } from "tractjs-core";

export class Tensor {
    data: TypedArray
    shape: number[]

    constructor(data: TypedArray, shape: number[]) {
        this.data = data;
        this.shape = shape;
    }
}
