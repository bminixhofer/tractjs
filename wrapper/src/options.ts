import type { DataType } from "tractjs-core";
type Format = "onnx" | "tensorflow";
type Shape = Array<number>;

type Fact = [DataType, Shape];

type Options = {
    format?: Format,
    inputs?: Array<string>,
    outputs?: Array<string>,
    inputFacts?: Record<number, Fact>,
}

type InternalOptions = {
    format: Format,
    inputs?: Array<string>,
    outputs?: Array<string>,
    inputFacts: Record<number, Fact>,
}

export { Format, Options, InternalOptions };