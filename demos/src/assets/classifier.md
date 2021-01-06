And then loaded and run in tractjs:

```javascript
let model = await tractjs.load("model.onnx", {
    inputFacts: {
        0: ["float32", ["s", 4]],
    },
    outputs: ["probabilities"],
});
let input = new tractjs.Tensor(new Float32Array([5.1, 3.5, 1.4, 0.2], [1, 4]))
let preds = await model.predict([input], { s: 1 });
```