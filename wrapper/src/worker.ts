import type { CoreModel } from "tract-js-core";
import { Tensor } from "./tensor";

const corePromise = import("tract-js-core");

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

export async function loadModel(url: string): Promise<number> {
    const core = await corePromise;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const model = await core.CoreModel.load(new Uint8Array(buffer));

    return store.add(model);;
}

export async function predict(modelId: number, tensors: Tensor[]): Promise<Tensor[]> {
    const core = await corePromise;
    const model = store.get(modelId);

    const inputs = new core.CoreTensorVec();
    tensors.forEach((tensor) => {
        const coreTensor = new core.CoreTensor(tensor.data, new Uint32Array(tensor.shape));

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

export function destroy(modelId: number) {
    store.remove(modelId);
}