# tractjs

Run ONNX and TensorFlow inference in the browser. A thin wrapper on top of [tract](https://github.com/snipsco/tract).

[Website](https://bminixhofer.github.io/tractjs/) | [API Docs](https://bminixhofer.github.io/tractjs/docs/)

## Why tractjs instead of ONNX.js?

There is currently one other usable ONNX runner for the browser, [ONNX.js](https://github.com/microsoft/onnxjs). There are a couple of things tractjs does better:
- tractjs supports more operators. LSTMs (even bidirectional) are supported, while ONNX.js does not support any recurrent networks.
- tractjs is maintained. At the time of writing the last significant commit to ONNX.js was more than one year ago.
- tractjs is more convenient to use. It can build to a single file `tractjs.min.js` which contains the inlined WASM and WebWorker. The WASM backend of ONNX.js can not as easily be used without a build system.

There are however also some downsides to tractjs. See the [FAQ](#faq). 

## Status

tractjs is not released yet. You can, however, use it today! The `master` branch builds to `https://bminixhofer.github.io/tractjs/dist/`.
Here is an example:

```html
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://bminixhofer.github.io/tractjs/dist/tractjs.min.js"></script>
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

This is however *very* prone to breaking.

CommonJS and ES6 modules are built as well. See https://github.com/bminixhofer/tractjs/tree/gh-pages/dist.

## Roadmap

See https://github.com/snipsco/tract/issues/269.

## FAQ

__What about size?__

At the time of writing, tractjs is very large for web standards (8.5MB raw, 2.5MB gzipped). This is due to tract being quite large, and due to some overhead from inlining the WASM. But it's not as bad as it sounds. You can load tractjs lazily along your demo, where you will likely have to load significantly large weights too. 

If you are working on a very size-sensitive application, get in touch and we can work on decreasing the size. There are some more optimizations to be done (e. g. an option not to inline WASM, and removing panics from the build). There is also ongoing work in tract to decrease size.

__What about WebGL / WebNN support?__

tractjs are bindings to the tract Rust library which was originally not intended to be run on the web. WebGL / WebNN support would be great, but would require lots of web-specific changes in tract so it is currently not under consideration.

__What are input facts?__

For some (mainly tensorflow) models tract needs information about the shape of the input to run inference. In that case, you can pass information about the input datatype and shape as an *input fact* like this:

```js
const model = new tractjs.Model("path/to/your/model", {
  inputFacts: {
    0: ["float32", [1, 3, 224, 224]]
  }
});
```

Also check out the [API docs](https://bminixhofer.github.io/tractjs/docs/).
