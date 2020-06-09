import { Tensor } from "./tensor";
import { Options } from "./options";
/**
 * A Tensorflow or ONNX model.
 *
 * Does not store the model directly.
 * The model is stored in a WebWorker which this class internally accesses via an ID.
 */
declare class Model {
    private modelId;
    /**
     * Loads a model.
     * @param url - The URL to load the model from. Will be passed to `fetch`.
     * @param options - Additional options. See {@link Options} for details.
     */
    constructor(url: string, options?: Options);
    /**
     * Runs the model on the given input.
     * The first call might be slower because it has to wait for model initialization to finish.
     * @param tensors - List of input tensors.
     *
     * @returns Promise for a list of output tensors.
     */
    predict(inputs: Tensor[]): Promise<Tensor[]>;
    /**
     * Removes all references to the internal model allowing it to be garbage collected.
     */
    destroy(): Promise<void>;
}
export { Model, Tensor };
