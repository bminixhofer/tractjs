use js_sys::{Error, Uint32Array};
use std::io::Cursor;
use tract_onnx::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen(typescript_custom_section)]
const TS_APPEND_CONTENT: &'static str = r#"
type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
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
        make_tensor!(js_sys::Int8Array);
        make_tensor!(js_sys::Uint8Array);
        make_tensor!(js_sys::Uint8ClampedArray);
        make_tensor!(js_sys::Int16Array);
        make_tensor!(js_sys::Uint16Array);
        make_tensor!(js_sys::Int32Array);
        // make_tensor!(js_sys::Uint32Array); TODO: clarify why no u32
        make_tensor!(js_sys::Float32Array);
        make_tensor!(js_sys::Float64Array);

        panic!("Could not be cast into any TypedArray object.")
    }

    pub fn data(&self) -> Result<JsValue, JsValue> {
        macro_rules! make_array {
            ( $tensor:expr, $array_type:ty ) => {{
                <$array_type>::from(
                    $tensor
                        .to_array_view()
                        .map_js_error()?
                        .as_slice()
                        .expect("slice is not contiguous"),
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

#[wasm_bindgen]
pub struct CoreModel {
    plan: TypedSimplePlan<TypedModel>,
}

#[wasm_bindgen]
impl CoreModel {
    pub fn load(data: Vec<u8>) -> Result<CoreModel, JsValue> {
        console_error_panic_hook::set_once();

        let mut reader = Cursor::new(data);

        let model = onnx().model_for_read(&mut reader).map_js_error()?;
        let mut model = model.into_optimized().map_js_error()?;

        model.auto_outputs().map_js_error()?;
        let plan = SimplePlan::new(model).map_js_error()?;

        Ok(CoreModel { plan })
    }

    pub fn predict(&self, data: CoreTensorVec) -> Result<CoreTensorVec, JsValue> {
        let outputs = self.plan.run(data.into_tvec()).map_js_error()?;
        Ok(CoreTensorVec::from_slice(&outputs))
    }
}
