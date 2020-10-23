# tractjs

[![npm version](https://img.shields.io/npm/v/tractjs)](https://www.npmjs.com/package/tractjs)
![Test](https://github.com/bminixhofer/tractjs/workflows/Test/badge.svg)
![Deploy to Github Pages](https://github.com/bminixhofer/tractjs/workflows/Deploy%20to%20Github%20Pages/badge.svg)

Run ONNX and TensorFlow inference in the browser. A thin wrapper on top of [tract](https://github.com/snipsco/tract).

The [Open Neural Network Exchange](https://onnx.ai/) is a format which many popular libraries like PyTorch, TensorFlow and MXNet can export to which allows tractjs to run neural networks from (almost) any library.

[Website](https://bminixhofer.github.io/tractjs/) | [API Docs](https://bminixhofer.github.io/tractjs/docs/)

## Why tractjs instead of ONNX.js?

There is currently one other usable ONNX runner for the browser, [ONNX.js](https://github.com/microsoft/onnxjs). There are a couple of things tractjs does better:

- tractjs supports more operators. LSTMs (even bidirectional) are supported, while ONNX.js does not support any recurrent networks.
- tractjs is maintained. At the time of writing the last significant commit to ONNX.js was more than one year ago.
- tractjs is more convenient to use. It can build to a single file `tractjs.min.js` which contains the inlined WASM and WebWorker. The WASM backend of ONNX.js can not as easily be used without a build system.

There are however also some downsides to tractjs. See the [FAQ](#faq).

## Getting started

### Without a bundler

```html
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://unpkg.com/tractjs/dist/tractjs.min.js"></script>
    <script>
      tractjs.load("path/to/your/model").then((model) => {
        model
          .predict([new tractjs.Tensor(new Float32Array([1, 2, 3, 4]), [2, 2])])
          .then((preds) => {
            console.log(preds);
          });
      });
    </script>
  </head>
</html>
```

### With a bundler

```
npm install tractjs
```

```js
import * as tractjs from "tractjs";

tractjs.load("path/to/your/model").then((model) => {
  model
    .predict([new tractjs.Tensor(new Float32Array([1, 2, 3, 4]), [2, 2])])
    .then((preds) => {
      console.log(preds);
    });
});
```

### With Node.js

tractjs now runs in Node.js! Models are fetched from the file system.

```js
const tractjs = require("tractjs");

tractjs.load("./path/to/your/model").then((model) => {
  model
    .predict([new tractjs.Tensor(new Float32Array([1, 2, 3, 4]), [2, 2])])
    .then((preds) => {
      console.log(preds);
    });
});
```

## FAQ

### My model with dynamic input dimensions doesn't work. Why?

Currently, tract requires has some restrictions on dynamic dimensions. If your model has a dynamic dimension, there's multiple solutions:

1. Declare a dynamic dimension via an input fact. Input facts are a way to provide additional information about input type and shape that can not be inferred via the model data:

```js
const model = await tractjs.load("path/to/your/model", {
  inputFacts: {
    0: ["float32", [1, "s", 224, 224]],
  },
});
```

This dimension must then be made concrete on prediction:

```js
model.predict(input, {
  "s": 3 // or some other value
})
```

The API supports multiple dynamic dimensions, but currently it will probably only work with one.

2. Set fixed input dimensions via input facts. This is of course not ideal because subsequently the model can only be passed inputs with this exact shape:

```js
const model = await tractjs.load("path/to/your/model", {
  inputFacts: {
    // be careful with image model input facts! here I use ONNX's NCHW format
    // if you are using TF you will probably need to use NHWC (`[1, 224, 224, 3]`).
    0: ["float32", [1, 3, 224, 224]],
  },
});
```

3. Turn `optimize` off. This is the nuclear option. It will turn off all optimizations relying on information about input shape. This will make sure your model work (even with multiple dynamic dimensions) but _significantly_ impact performance:

```js
const model = await tractjs.load("path/to/your/model", {
  optimize: false,
});
```

### What about size?

At the time of writing, tractjs is very large for web standards (6.2MB raw, 2.1MB gzipped). This is due to tract being quite large, and due to some overhead from inlining the WASM. But it's not as bad as it sounds. You can load tractjs lazily along your demo, where you will likely have to load significantly large weights too.

If you are working on a very size-sensitive application, get in touch and we can work on decreasing the size. There are some more optimizations to be done (e. g. an option not to inline WASM, and removing panics from the build). There is also ongoing work in tract to decrease size.

### What about WebGL / WebNN support?

tractjs are bindings to the tract Rust library which was originally not intended to be run on the web. WebGL / WebNN support would be great, but would require lots of web-specific changes in tract so it is currently not under consideration.

## License

### Apache 2.0/MIT

All original work licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
  at your option.

### Contribution

Contributions are very welcome! See [CONTRIBUTING.md](/CONTRIBUTING.md).
