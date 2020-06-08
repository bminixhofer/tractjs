import { Tensor } from "./tensor";
import type { InternalOptions } from "./options";
import { CoreModel, CoreTensorVec, CoreTensor } from "tractjs-core";
import init from "tractjs-core";
import wasm from "../core/tractjs_core_bg.wasm";

const initialize = init(wasm());

const ctx = (self as unknown) as Worker;

class ModelStorage {
    store: { [id: number]: CoreModel } = {}

    add(model: CoreModel): number {
        let id = 0;

        while (this.store[id] !== undefined) {
            id++;
        }

        this.store[id] = model;
        return id;
    }

    get(id: number): CoreModel {
        return this.store[id];
    }

    remove(id: number) {
        delete this.store[id];
    }
}

const store = new ModelStorage();

async function load(data: Uint8Array, options: InternalOptions): Promise<number> {
    await initialize;

    const model = CoreModel.load(data, options.format == "onnx", options.inputs, options.outputs, options.inputFacts);
    return store.add(model);
}

async function predict(modelId: number, tensors: Tensor[]): Promise<Tensor[]> {
    await initialize;
    const model = store.get(modelId);

    const inputs = new CoreTensorVec();
    tensors.forEach((tensor) => {
        const coreTensor = new CoreTensor(tensor.data, new Uint32Array(tensor.shape));

        inputs.push(coreTensor);
    });

    const outputs = model.predict(inputs);
    const outputTensors = [];

    for (let i = 0; i < outputs.length; i++) {
        const coreTensor = outputs.get(0);
        const tensor = new Tensor(coreTensor.data(), Array.from(coreTensor.shape()));

        outputTensors.push(tensor);
    }

    return outputTensors;
}

async function destroy(modelId: number): Promise<void> {
    store.remove(modelId);
}

ctx.addEventListener("message", e => {
    const data = e.data;
    let promise;

    switch (data.type) {
        case "load":
            promise = load(data.body.data, data.body.options);
            break;
        case "predict":
            promise = predict(data.body.modelId, data.body.tensors);
            break;
        case "destroy":
            promise = destroy(data.body);
            break;
        default:
            throw new Error(`could not find type ${data.type}`);
    }

    (promise as Promise<unknown>).then((body) => {
        ctx.postMessage({
            type: data.type,
            body,
            uid: data.uid,
        });
    });
});