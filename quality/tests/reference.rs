use ndarray_rand::rand_distr::Normal;
use ndarray_rand::RandomExt;
use serde::{Deserialize, Serialize};
use std::borrow::Borrow;
use std::env;
use std::fs::File;
use std::io::{BufWriter, Cursor};
use std::path::Path;
use tract_onnx::prelude::*;

fn random_from_shape<S>(shape: S) -> Tensor
where
    S: tract_ndarray::ShapeBuilder,
{
    tract_ndarray::Array::random(shape, Normal::new(0. as f32, 1. as f32).unwrap()).into()
}

#[derive(Serialize, Deserialize)]
struct SerializeableTensor<T: Serialize> {
    data: Vec<T>,
    shape: Vec<usize>,
}

fn serialize_tensors<T, I, P>(tensors: I, file: P)
where
    T: Borrow<Tensor>,
    I: IntoIterator<Item = T>,
    P: AsRef<Path>,
{
    macro_rules! as_type_vec {
        ($tensor: expr, $type: ty) => {
            $tensor
                .to_array_view::<$type>()
                .unwrap()
                .as_slice()
                .unwrap()
                .iter()
                .map(|x| *x as $type)
                .collect()
        };
    };

    let tensors: Vec<_> = tensors
        .into_iter()
        .map(|tensor| {
            let tensor = tensor.borrow();
            SerializeableTensor {
                data: match tensor.datum_type() {
                    DatumType::F32 => as_type_vec!(tensor, f32),
                    _ => panic!("unimplemented type"),
                },
                shape: tensor.shape().to_vec(),
            }
        })
        .collect();

    serde_json::to_writer(BufWriter::new(File::create(file).unwrap()), &tensors).unwrap();
}

fn no_options_onnx<P1: AsRef<Path>, P2: AsRef<Path>>(
    input_file: P1,
    output_file: P2,
) -> TractResult<()> {
    let mut cursor =
        Cursor::new(include_bytes!("../models/data/squeezenet_1_1/model.onnx") as &[u8]);
    let model = tract_onnx::onnx()
        .model_for_read(&mut cursor)?
        .into_optimized()?
        .into_runnable()?;

    let inputs = tvec![random_from_shape((1, 3, 224, 224))];
    serialize_tensors(&inputs, input_file);

    let preds = model.run(inputs)?;
    serialize_tensors(preds, output_file);

    Ok(())
}

fn no_options_tf<P1: AsRef<Path>, P2: AsRef<Path>>(
    input_file: P1,
    output_file: P2,
) -> TractResult<()> {
    let mut cursor = Cursor::new(include_bytes!("../models/data/squeezenet_1_1/model.pb") as &[u8]);
    let model = tract_tensorflow::tensorflow()
        .model_for_read(&mut cursor)?
        .with_input_fact(
            0,
            InferenceFact::dt_shape(f32::datum_type(), tvec!(1, 227, 227, 3)),
        )?
        .into_optimized()?
        .into_runnable()?;

    let inputs = tvec![random_from_shape((1, 227, 227, 3))];
    serialize_tensors(&inputs, input_file);

    let preds = model.run(inputs)?;
    serialize_tensors(preds, output_file);

    Ok(())
}

fn custom_output_onnx<P1: AsRef<Path>, P2: AsRef<Path>>(
    input_file: P1,
    output_file: P2,
) -> TractResult<()> {
    let mut cursor =
        Cursor::new(include_bytes!("../models/data/squeezenet_1_1/model.onnx") as &[u8]);
    let model = tract_onnx::onnx()
        .model_for_read(&mut cursor)?
        .with_output_names(&["squeezenet0_conv8_fwd", "squeezenet0_conv9_fwd"])?
        .into_optimized()?
        .into_runnable()?;

    let inputs = tvec![random_from_shape((1, 3, 224, 224))];
    serialize_tensors(&inputs, input_file);

    let preds = model.run(inputs)?;
    serialize_tensors(preds, output_file);

    Ok(())
}

fn custom_input_tf<P1: AsRef<Path>, P2: AsRef<Path>>(
    input_file: P1,
    output_file: P2,
) -> TractResult<()> {
    let mut cursor = Cursor::new(include_bytes!("../models/data/squeezenet_1_1/model.pb") as &[u8]);
    let model = tract_tensorflow::tensorflow()
        .model_for_read(&mut cursor)?
        .with_input_fact(
            0,
            InferenceFact::dt_shape(f32::datum_type(), tvec!(1, 227, 227, 3)),
        )?
        .with_input_names(&["fire5/relu_expand1x1/Relu", "fire5/relu_expand3x3/Relu"])?
        .into_optimized()?
        .into_runnable()?;

    let inputs = tvec![
        random_from_shape((1, 27, 27, 128)),
        random_from_shape((1, 27, 27, 128))
    ];
    serialize_tensors(&inputs, input_file);

    let preds = model.run(inputs)?;
    serialize_tensors(preds, output_file);

    Ok(())
}

fn main() -> TractResult<()> {
    let args: Vec<String> = env::args().collect();
    let name = &args[1];
    let (input_file, output_file) = (&args[2], &args[3]);

    match name.as_str() {
        "simple_onnx" => no_options_onnx(input_file, output_file)?,
        "simple_tf" => no_options_tf(input_file, output_file)?,
        "custom_output_onnx" => custom_output_onnx(input_file, output_file)?,
        "custom_input_tf" => custom_input_tf(input_file, output_file)?,
        _ => panic!(format!("unknown name {}.", name)),
    };

    Ok(())
}
