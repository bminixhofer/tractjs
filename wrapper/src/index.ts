import TractWorker from "web-worker:./worker.ts";
import { Tensor } from "./tensor";
import { Format, Options, InternalOptions } from "./options";

const worker: Worker = new TractWorker();

function call(type: string, body: unknown): Promise<unknown> {
  const uid = Math.random().toString(36);
  worker.postMessage({ type, body, uid });

  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
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

/**
 * A Tensorflow or ONNX model.
 *
 * Does not store the model directly.
 * The model is stored in a WebWorker which this class internally accesses via an ID.
 */
class Model {
  private modelId: Promise<number>;
  /**
   * Loads a model.
   * @param url - The URL to load the model from. Will be passed to `fetch`.
   * @param options - Additional options. See {@link Options} for details.
   */
  constructor(url: string, options?: Options) {
    options = options || {};

    // try to infer the format based on file extension
    if (options.format === undefined) {
      const formatEndings = {
        onnx: [".onnx"],
        tensorflow: [".pb"],
      };

      for (const [format, endings] of Object.entries(formatEndings)) {
        if (endings.some((ending) => url.endsWith(ending))) {
          options.format = format as Format;
          break;
        }
      }
    }

    // if format is still undefined (i. e. couldn't be inferred) throw an error
    if (options.format === undefined) {
      throw new Error(
        `format could not be inferred from URL "${url}". Please specify it manually.`
      );
    }

    // cast to fully-determined internal options so worker doesn't have to worry about properties being undefined
    const internalOptions: InternalOptions = {
      format: options.format,
      optimize: options.optimize !== undefined ? options.optimize : true,
      inputs: options.inputs,
      outputs: options.outputs,
      inputFacts: options.inputFacts !== undefined ? options.inputFacts : {},
    };

    this.modelId = load(url).then((data) =>
      call("load", { data, options: internalOptions })
    ) as Promise<number>;
  }

  /**
   * Runs the model on the given input.
   * The first call might be slower because it has to wait for model initialization to finish.
   * @param tensors - List of input tensors.
   *
   * @returns Promise for a list of output tensors.
   */
  async predict(inputs: Tensor[]): Promise<Tensor[]> {
    return await (call("predict", {
      modelId: await this.modelId,
      tensors: inputs,
    }) as Promise<Tensor[]>);
  }

  /**
   * Removes all references to the internal model allowing it to be garbage collected.
   */
  async destroy(): Promise<void> {
    await call("destroy", { modelId: await this.modelId });
  }
}

export { Model, Tensor };
