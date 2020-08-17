use js_sys::{Array, Error, Object, Uint32Array};
use std::io::Cursor;
use tract_hir::prelude::*;
// use tract_onnx::prelude::*;
// use tract_tensorflow::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use std::convert::TryInto;

#[wasm_bindgen(typescript_custom_section)]
const TS_APPEND_CONTENT: &'static str = r#"
type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
type DataType = "int8" | "uint8" | "int16" | "uint16" | "int32" | "uint32" | "float32" | "float64";
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "TypedArray")]
    pub type TypedArray;
}

pub trait TractResultExt<T> {
    fn map_js_error(self) -> Result<T, Error>;
}

impl<T: std::fmt::Debug> TractResultExt<T> for TractResult<T> {
    fn map_js_error(self) -> Result<T, Error> {
        match self {
            Ok(x) => Ok(x),
            Err(x) => Err(Error::new(&format!("{:#?}", x))),
        }
    }
}

fn fact_from_js(input: JsValue) -> TypedFact {
    let input: Array = input.dyn_into().expect("fact must be an Array.");
    let dtype = if let Some(string) = input.get(0).as_string() {
        Some(match string.as_str() {
            "int8" => i8::datum_type(),
            "uint8" => u8::datum_type(),
            "int16" => i16::datum_type(),
            "uint16" => u16::datum_type(),
            "int32" => i32::datum_type(),
            "float32" => f32::datum_type(),
            "float64" => f64::datum_type(),
            _ => panic!("unsupported data type"),
        })
    } else {
        None
    };

    let shape = if let Ok(shape) = input.get(1).dyn_into::<Array>() {
        Some(
            shape
                .iter()
                .map(|x| x.as_f64().expect("fact[1] must be an Array of numbers.") as usize)
                .collect::<Vec<_>>(),
        )
    } else {
        None
    };

    match (dtype, shape) {
        (Some(dtype), Some(shape)) => {
            let shape: ShapeFact = (&shape[..]).try_into().unwrap();
            TypedFact::dt_shape(dtype, shape).unwrap()
        },
        _ => panic!("either dtype or shape must be specified."),
    }
}

#[wasm_bindgen]
pub struct CoreTensorVec {
    tensors: Vec<CoreTensor>,
}

#[wasm_bindgen]
impl CoreTensorVec {
    fn into_tvec(self) -> TVec<Tensor> {
        TVec::from_vec(self.tensors.into_iter().map(|x| x.into()).collect())
    }

    fn from_slice<T: AsRef<Tensor>>(tvec: &[T]) -> Self {
        CoreTensorVec {
            tensors: tvec.iter().map(|x| x.as_ref().clone().into()).collect(),
        }
    }

    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        CoreTensorVec {
            tensors: Vec::new(),
        }
    }

    pub fn push(&mut self, tensor: CoreTensor) {
        self.tensors.push(tensor);
    }

    #[wasm_bindgen(getter)]
    pub fn length(&self) -> usize {
        self.tensors.len()
    }

    pub fn get(&self, idx: usize) -> CoreTensor {
        self.tensors[idx].clone()
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct CoreTensor {
    inner: Tensor,
}

#[wasm_bindgen]
impl CoreTensor {
    fn from_shape_vec<T: Datum>(data: Vec<T>, shape: Uint32Array) -> CoreTensor {
        let shape: Vec<usize> = shape.to_vec().into_iter().map(|x| x as usize).collect();

        let data = tract_ndarray::Array::from_shape_vec(shape, data).unwrap();
        CoreTensor { inner: data.into() }
    }

    #[wasm_bindgen(constructor)]
    pub fn new(data: TypedArray, shape: Uint32Array) -> CoreTensor {
        macro_rules! make_tensor {
            ( $array_type:ty ) => {{
                if let Some(array) = data.dyn_ref::<$array_type>() {
                    return CoreTensor::from_shape_vec(array.to_vec(), shape);
                }
            }};
        }

        // must support all TypedArray objects, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
        // BigInt64Array and BigUint64Array are not supported because of no support in js_sys
        // Uint32Array is not supported because of no support in tract
        make_tensor!(js_sys::Int8Array);
        make_tensor!(js_sys::Uint8Array);
        make_tensor!(js_sys::Uint8ClampedArray);
        make_tensor!(js_sys::Int16Array);
        make_tensor!(js_sys::Uint16Array);
        make_tensor!(js_sys::Int32Array);
        make_tensor!(js_sys::Float32Array);
        make_tensor!(js_sys::Float64Array);

        panic!("could not be cast into any TypedArray object.")
    }

    pub fn data(&self) -> Result<JsValue, JsValue> {
        macro_rules! make_array {
            ( $tensor:expr, $array_type:ty ) => {{
                <$array_type>::from(
                    $tensor
                        .to_array_view()
                        .map_js_error()?
                        .as_slice()
                        .expect("slice is not contiguous."),
                )
            }};
        }

        match self.inner.datum_type() {
            DatumType::I8 => Ok(make_array!(self.inner, js_sys::Int8Array).into()),
            DatumType::U8 => Ok(make_array!(self.inner, js_sys::Uint8Array).into()),
            DatumType::I16 => Ok(make_array!(self.inner, js_sys::Int16Array).into()),
            DatumType::U16 => Ok(make_array!(self.inner, js_sys::Uint16Array).into()),
            DatumType::I32 => Ok(make_array!(self.inner, js_sys::Int32Array).into()),
            DatumType::F32 => Ok(make_array!(self.inner, js_sys::Float32Array).into()),
            DatumType::F64 => Ok(make_array!(self.inner, js_sys::Float64Array).into()),
            _ => panic!("unsupported data type"),
        }
    }

    pub fn shape(&self) -> Vec<usize> {
        self.inner.shape().to_vec()
    }
}

impl From<Tensor> for CoreTensor {
    fn from(tensor: Tensor) -> Self {
        CoreTensor { inner: tensor }
    }
}

impl From<CoreTensor> for Tensor {
    fn from(tensor: CoreTensor) -> Self {
        tensor.inner
    }
}

enum Model {
    Inference(tract_hir::infer::InferenceSimplePlan<InferenceModel>),
    Typed(TypedSimplePlan<TypedModel>),
}

impl Model {
    fn run(&self, inputs: TVec<Tensor>) -> TractResult<TVec<Arc<Tensor>>> {
        match self {
            Model::Inference(x) => x.run(inputs),
            Model::Typed(x) => x.run(inputs),
        }
    }
}

impl From<tract_hir::infer::InferenceSimplePlan<InferenceModel>> for Model {
    fn from(input: tract_hir::infer::InferenceSimplePlan<InferenceModel>) -> Self {
        Model::Inference(input)
    }
}

impl From<TypedSimplePlan<TypedModel>> for Model {
    fn from(input: TypedSimplePlan<TypedModel>) -> Self {
        Model::Typed(input)
    }
}

#[wasm_bindgen]
pub struct CoreModel {
    model: Model,
}

#[wasm_bindgen]
impl CoreModel {
    pub fn load(
        data: Vec<u8>,
        use_onnx: bool,
        optimize: bool,
        inputs: Option<Array>,
        outputs: Option<Array>,
        input_facts: Object,
    ) -> Result<CoreModel, JsValue> {
        console_error_panic_hook::set_once();

        let mut reader = Cursor::new(data);

        let mut model = tract_nnef::nnef().model_for_read(&mut reader)
            .map_js_error()?;

        for (index, fact) in Object::keys(&input_facts)
            .iter()
            .zip(Object::values(&input_facts).iter())
        {
            let fact = fact_from_js(fact);

            model
                .set_input_fact(
                    index
                        .as_string()
                        .unwrap()
                        .parse::<usize>()
                        .expect("fact index must be parsable as unsigned integer."),
                    fact,
                )
                .map_js_error()?;
        }

        if let Some(inputs) = inputs {
            model
                .set_input_names(inputs.iter().map(|x| {
                    x.as_string()
                        .expect("`inputs` must consist of valid strings.")
                }))
                .map_js_error()?;
        }

        if let Some(outputs) = outputs {
            model
                .set_output_names(outputs.iter().map(|x| {
                    x.as_string()
                        .expect("`outputs` must consist of valid strings.")
                }))
                .map_js_error()?;
        }

        let model: Model = if optimize {
            model
                .into_optimized()
                .map_js_error()?
                .into_runnable()
                .map_js_error()?
                .into()
        } else {
            model.into_runnable().map_js_error()?.into()
        };

        Ok(CoreModel { model })
    }

    pub fn predict(&self, data: CoreTensorVec) -> Result<CoreTensorVec, JsValue> {
        let outputs = self.model.run(data.into_tvec()).map_js_error()?;
        Ok(CoreTensorVec::from_slice(&outputs))
    }
}
