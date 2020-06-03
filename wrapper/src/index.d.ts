import { Tensor } from "./tensor";
declare class Model {
    modelId: Promise<number>;
    constructor(url: string);
    predict(tensors: Tensor[]): Promise<Tensor[]>;
    destroy(): Promise<void>;
}
export { Model, Tensor };
