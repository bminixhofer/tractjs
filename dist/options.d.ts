import type { DataType } from "tractjs-core";
declare type SymbolValues = {
    [id: string]: number;
};
declare type DimSymbol = string | {
    id: string;
    slope: number;
    intercept: number;
};
declare type Format = "onnx" | "tensorflow";
declare type Shape = Array<number | DimSymbol>;
declare type Fact = [DataType, Shape];
/**
 * Model loading options.
 */
declare type Options = {
    /**
     * The model format. Either `"onnx"` or `"tensorflow"`. If undefined, will attempt to infer from URL file extension.
     */
    format?: Format;
    /**
     * Whether to optimize the model. Currently only works if the input shape is fully determined. If you need e. g. dynamic batch sizes set this to `false`. `true` by default.
     */
    optimize?: boolean;
    /**
     * The node names of model inputs. Passed to [`set_input_names`](https://docs.rs/tract-core/0.11.1/tract_core/model/struct.ModelImpl.html#method.set_input_names).
     */
    inputs?: Array<string>;
    /**
     * The node names of model outputs. Passed to [`set_output_names`](https://docs.rs/tract-core/0.11.1/tract_core/model/struct.ModelImpl.html#method.set_output_names).
     */
    outputs?: Array<string>;
    /**
     * Mapping of indices to facts to set for the input. Each fact is passed to [`set_input_fact`](https://docs.rs/tract-core/0.11.1/tract_core/model/struct.ModelImpl.html#method.set_input_fact).
     */
    inputFacts?: Record<number, Fact>;
};
declare type InternalOptions = {
    format: Format;
    optimize: boolean;
    inputs?: Array<string>;
    outputs?: Array<string>;
    inputFacts: Record<number, Fact>;
};
export { Format, Options, InternalOptions, SymbolValues };
