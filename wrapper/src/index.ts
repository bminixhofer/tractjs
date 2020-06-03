import * as TractWorker from "workerize-loader!./worker.ts";
import { Tensor } from "./tensor";

const worker = new TractWorker();

class Model {
    modelId: Promise<number>;

    constructor(url: string) {
        this.modelId = worker.loadModel(url);
    }

    async predict(tensors: Tensor[]): Promise<Tensor[]> {
        return await worker.predict(await this.modelId, tensors);
    }

    async destroy() {
        await worker.destroy(await this.modelId);
    }
}

export { Model, Tensor };