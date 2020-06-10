#!/usr/bin/env sh

set -e

python -m venv venv
. venv/bin/activate
pip install -r requirements.txt

## Squeeznet v1.1

MODEL_DIR=data/squeezenet_1_1
mkdir -p $MODEL_DIR

# TF frozen model
python download_squeezenet_1_1.py model.hdf5
python keras_to_tensorflow/keras_to_tensorflow.py --input_model=model.hdf5 --output_model=$MODEL_DIR/model.pb
rm model.hdf5

# ONNX model
wget https://github.com/microsoft/onnxjs-demo/raw/master/public/squeezenet1_1.onnx
mv squeezenet1_1.onnx $MODEL_DIR/model.onnx