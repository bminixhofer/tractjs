# tractjs

[![npm version](https://img.shields.io/npm/v/tractjs)](https://www.npmjs.com/package/tractjs)
![Test](https://github.com/bminixhofer/tractjs/workflows/Test/badge.svg)
![Deploy to Github Pages](https://github.com/bminixhofer/tractjs/workflows/Deploy%20to%20Github%20Pages/badge.svg)

Run ONNX and TensorFlow inference in the browser. A thin wrapper on top of [tract](https://github.com/snipsco/tract).

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
      const model = new tractjs.Model("path/to/your/model");
      model
        .predict([new tractjs.Tensor(new Float32Array([1, 2, 3, 4]), [2, 2])])
        .then((preds) => {
          console.log(preds);
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

const model = new tractjs.Model("path/to/your/model");
model
  .predict([new tractjs.Tensor(new Float32Array([1, 2, 3, 4]), [2, 2])])
  .then((preds) => {
    console.log(preds);
  });
```

## FAQ

**My model with dynamic input dimensions doesn't work. Why?**

Currently, tract requires fully determined input dimensions to optimize a model. There are two options:

1. Turn `optimize` off:

```js
const model = new tractjs.Model("path/to/your/model", {
  optimize: false,
});
```

This will however *significantly* impact performance.

2. Set fixed input dimensions via input facts. Input facts are a way to provide additional information about input type and shape that can not be inferred via the model data:

```js
const model = new tractjs.Model("path/to/your/model", {
  inputFacts: {
    0: ["float32", [1, 3, 224, 224]],
  },
});
```

Be aware that the model will only work properly with inputs of this exact shape though.

There is ongoing work in tract to allow dynamically sized inputs.

**What about size?**

At the time of writing, tractjs is very large for web standards (8.5MB raw, 2.5MB gzipped). This is due to tract being quite large, and due to some overhead from inlining the WASM. But it's not as bad as it sounds. You can load tractjs lazily along your demo, where you will likely have to load significantly large weights too.

If you are working on a very size-sensitive application, get in touch and we can work on decreasing the size. There are some more optimizations to be done (e. g. an option not to inline WASM, and removing panics from the build). There is also ongoing work in tract to decrease size.

**What about WebGL / WebNN support?**

tractjs are bindings to the tract Rust library which was originally not intended to be run on the web. WebGL / WebNN support would be great, but would require lots of web-specific changes in tract so it is currently not under consideration.

## License

### Apache 2.0/MIT

All original work licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
  at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall
be dual licensed as above, without any additional terms or conditions.
