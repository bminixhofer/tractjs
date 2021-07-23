import { Tensor } from "./tensor";
import { Options, Metadata } from "./options";
/**
 * A Tensorflow or ONNX model.
 *
 * Does not store the model directly.
 * The model is stored in a WebWorker which this class internally accesses via an ID.
 */
declare class Model {
    private modelId;
    private constructor();
    /**
     * Loads a model.
     * @param url - The URL to load the model from. Will be passed to `fetch`.
     * @param options - Additional options. See {@link Options} for details.
     */
    static load(url: string, options?: Options): Promise<Model>;
    /**
     * Runs the model on the given input.
     * @param inputs - List of input tensors.
     *
     * @returns Promise for a list of output tensors.
     */
    predict(inputs: Tensor[]): Promise<Tensor[]>;
    /**
     * Runs the model on a single input tensor.
     * This method is provided as convenience method for interfacing with Rust WASM, since arrays of custom objects are not supported yet.
     * @param input - a single input tensor.
     *
     * @returns The first output tensor.
     */
    predict_one(input: Tensor): Promise<Tensor>;
    /**
     * Gets metadata of the model.
     *
     * @returns An object corresponding to the key "metadata_props" of an ONNX model, or an empty object for a TF model.
     */
    get_metadata(): Promise<Metadata>;
    /**
     * Removes all references to the internal model allowing it to be garbage collected.
     */
    destroy(): Promise<void>;
}
/**
 * Loads a model. Alias for `Model.load`.
 * @param url - The URL to load the model from. Will be passed to `fetch`.
 * @param options - Additional options. See {@link Options} for details.
 */
declare const load: typeof Model.load;
/**
 * Utility function for terminating the worker from outside of the module.
 */
declare function terminate(): void;
export { Model, Tensor, load, terminate };
