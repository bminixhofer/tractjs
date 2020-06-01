use js_sys::{Array, ArrayBuffer, Error, Uint32Array, Uint8Array};
use std::io::{Cursor, Read};
use tract_onnx::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::Response;

async fn fetch(url: &str) -> Result<impl Read, JsValue> {
    let window = web_sys::window().expect("couldn't get window object");
    let response: Response = JsFuture::from(window.fetch_with_str(url)).await?.into();
    let array_buffer: ArrayBuffer = JsFuture::from(response.array_buffer()?).await?.into();

    let data: Uint8Array = Uint8Array::new(&array_buffer.into());

    Ok(Cursor::new(data.to_vec()))
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

mod js_tensor {
    use super::*;

    #[wasm_bindgen]
    #[derive(Debug)]
    pub struct Tensor {
        inner: super::Tensor,
    }

    #[wasm_bindgen]
    impl Tensor {
        fn from_shape_vec<T: Datum>(data: Vec<T>, shape: Array) -> Tensor {
            let shape: Vec<usize> = Uint32Array::new(&shape)
                .to_vec()
                .into_iter()
                .map(|x| x as usize)
                .collect();

            let data = tract_ndarray::Array::from_shape_vec(shape, data).unwrap();
            Tensor { inner: data.into() }
        }

        #[wasm_bindgen(constructor)]
        pub fn new(data: JsValue, shape: Array) -> Result<Tensor, JsValue> {
            if let Some(array) = data.dyn_ref::<js_sys::Float64Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Float32Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Uint16Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Uint8Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Uint8ClampedArray>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Int32Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Int16Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else if let Some(array) = data.dyn_ref::<js_sys::Int8Array>() {
                Ok(Tensor::from_shape_vec(array.to_vec(), shape))
            } else {
                Err("asdf".into())
            }
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
                DatumType::F64 => Ok(make_array!(self.inner, js_sys::Float64Array).into()),
                DatumType::F32 => Ok(make_array!(self.inner, js_sys::Float32Array).into()),
                DatumType::U16 => Ok(make_array!(self.inner, js_sys::Uint16Array).into()),
                DatumType::U8 => Ok(make_array!(self.inner, js_sys::Uint8Array).into()),
                DatumType::I32 => Ok(make_array!(self.inner, js_sys::Int32Array).into()),
                DatumType::I16 => Ok(make_array!(self.inner, js_sys::Int16Array).into()),
                DatumType::I8 => Ok(make_array!(self.inner, js_sys::Int8Array).into()),
                _ => panic!("unsupported data type"),
            }
        }

        pub fn shape(&self) -> Vec<usize> {
            self.inner.shape().to_vec()
        }
    }

    impl Tensor {
        pub fn from_tract_tensor(tensor: super::Tensor) -> Tensor {
            Tensor { inner: tensor }
        }

        pub fn inner(self) -> super::Tensor {
            self.inner
        }
    }
}

#[wasm_bindgen]
pub struct Model {
    plan: TypedSimplePlan<TypedModel>,
}

#[wasm_bindgen]
impl Model {
    #[wasm_bindgen(constructor)]
    pub async fn load(url: String) -> Result<Model, JsValue> {
        console_error_panic_hook::set_once();

        let mut reader = fetch(&url).await?;

        let model = onnx().model_for_read(&mut reader).map_js_error()?;
        let mut model = model.into_optimized().map_js_error()?;

        model.auto_outputs().map_js_error()?;
        let plan = SimplePlan::new(model).map_js_error()?;

        Ok(Model { plan })
    }

    pub fn predict(&self, data: js_tensor::Tensor) -> Result<js_tensor::Tensor, JsValue> {
        let outputs = self.plan.run(tvec![data.inner()]).map_js_error()?;
        Ok(js_tensor::Tensor::from_tract_tensor((*outputs[0]).clone()))
    }
}
