LightGBM models can be exported to ONNX via [hummingbird](https://github.com/microsoft/hummingbird):

```python
import torch
from hummingbird.ml import convert
from lightgbm.sklearn import LGBMRegressor
from sklearn import datasets

# load a sample dataset
x, y = datasets.load_boston(return_X_y=True)

# fit the model
model = LGBMRegressor(n_estimators=10)
model.fit(x, y)

pytorch_model = convert(model, "pytorch")

# export to ONNX
torch.onnx.export(
    pytorch_model.model,
    (torch.from_numpy(x)),
    "model.onnx",
    input_names=["input"],
    output_names=["variable"],
    dynamic_axes={"input": {0: "batch"}, "variable": {0: "batch"}},
)
```


And then loaded and run in tractjs:

```javascript
let model = await tractjs.load("model.onnx", {
    inputFacts: {
        0: ["float32", ["s", 13]],
    },
});
let input = new tractjs.Tensor(new Float32Array([0.00632, 18.0, 2.31, 0.0, 0.538, 6.575, 65.2, 4.09, 1.0, 296.0, 15.3, 396.9, 4.98]), [1, 13]);
let preds = await model.predict([input], { s: 1 });
```