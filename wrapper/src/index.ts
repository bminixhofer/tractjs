import TractWorker from "web-worker:./worker.ts";
import { Tensor } from "./tensor";

const worker: Worker = new TractWorker();

function call(type: string, body: unknown): Promise<unknown> {
    const uid = Math.random().toString(36);
    worker.postMessage({ type, body, uid });

    return new Promise((resolve) => {
        const handler = (e: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
            if (e.data.uid === uid) {
                worker.removeEventListener("message", handler);
                resolve(e.data.body);
            }
        };

        worker.addEventListener("message", handler);
    });
}

async function load(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = new Uint8Array(buffer);

    return data;
}

class Model {
    modelId: Promise<number>;

    constructor(url: string) {
        this.modelId = (load(url).then((data) => call("load", { data })) as Promise<number>);
    }

    async predict(tensors: Tensor[]): Promise<Tensor[]> {
        return await (call("predict", { modelId: await this.modelId, tensors }) as Promise<Tensor[]>);
    }

    async destroy(): Promise<void> {
        await call("destroy", { modelId: await this.modelId });
    }
}

export { Model, Tensor };