#!/usr/bin/env sh

set -e

python -m venv venv
. venv/bin/activate
pip install -r requirements.txt

## Squeeznet v1.1

MODEL_DIR=data/squeezenet_1_1
mkdir -p $MODEL_DIR

# TF frozen model + TFJS model
python download_squeezenet_1_1.py model.h5
python keras_to_tensorflow/keras_to_tensorflow.py --input_model=model.h5 --output_model=$MODEL_DIR/model.pb
tensorflowjs_converter --input_format=keras model.h5 $MODEL_DIR/tfjs_model
rm model.h5

# ONNX model
wget https://github.com/microsoft/onnxjs-demo/raw/master/public/squeezenet1_1.onnx
mv squeezenet1_1.onnx $MODEL_DIR/model.onnx

## Byte-level sentence boundary detection bidirectional LSTM

MODEL_DIR=data/byte_sb_lstm
mkdir -p $MODEL_DIR

# TFJS model
mkdir -p $MODEL_DIR/tfjs_model
wget -P $MODEL_DIR/tfjs_model https://api.wandb.ai/files/bminixhofer/nnsplit/3oboozav/model/tensorflowjs_model/group1-shard1of1.bin
wget -P $MODEL_DIR/tfjs_model https://api.wandb.ai/files/bminixhofer/nnsplit/3oboozav/model/tensorflowjs_model/model.json

# ONNX model
wget -P $MODEL_DIR https://api.wandb.ai/files/bminixhofer/nnsplit/3oboozav/model/model.onnx
