import { Tensor } from "./tensor";
export declare function loadModel(url: string): Promise<number>;
export declare function predict(modelId: number, tensors: Tensor[]): Promise<Tensor[]>;
export declare function destroy(modelId: number): void;
