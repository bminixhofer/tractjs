LightGBM models can be exported to ONNX via [hummingbird](https://github.com/microsoft/hummingbird):

```python
import numpy as np
from sklearn import datasets
from lightgbm.sklearn import LGBMClassifier
from hummingbird.ml import convert
import onnxruntime
import torch

# load a sample dataset
x, y = datasets.load_iris(return_X_y=True)
x = x.astype(np.float32)

# fit the model
model = LGBMClassifier(n_estimators=10)
model.fit(x, y)

pytorch_model = convert(model, "pytorch")

# export to ONNX
torch.onnx.export(
    pytorch_model.model,
    (torch.from_numpy(x)),
    "model.onnx",
    input_names=["input"],
    output_names=["output", "probabilities"],
    dynamic_axes={
        "input": {0: "batch"},
        "output": {0: "batch"},
        "probabilities": {0: "batch"},
    },
)
```
