# tractjs

Run ONNX and TensorFlow inference in the browser. A thin wrapper on top of [tract](https://github.com/snipsco/tract).

[Website](https://bminixhofer.github.io/tractjs/) | [API Docs](https://bminixhofer.github.io/tractjs/docs/)

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
