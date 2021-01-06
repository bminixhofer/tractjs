XGBoost models can be exported to ONNX via [onnxmltools](https://github.com/onnx/onnxmltools):

```python
import numpy as np
import onnx
import onnxmltools
from onnxmltools.convert.common import data_types
from sklearn import datasets
from xgboost.sklearn import XGBClassifier

# load a sample dataset
x, y = datasets.load_iris(return_X_y=True)
x = x.astype(np.float32)

# fit the model
model = XGBClassifier(n_estimators=10, use_label_encoder=False)
model.fit(x, y)

# export to ONNX
onnx_model = onnxmltools.convert_xgboost(
    model, initial_types=[("input", data_types.FloatTensorType([None, x.shape[1]]))],
)
onnx.save(onnx_model, "model.onnx")
```
