use js_sys::{Array, ArrayBuffer, Float32Array, Uint32Array, Uint8Array};
use std::io::{Cursor, Read};
use tract_onnx::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::Response;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn time(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn timeEnd(s: &str);
}

async fn fetch(url: &str) -> Result<impl Read, JsValue> {
    let window = web_sys::window().expect("couldn't get window object");
    let response: Response = JsFuture::from(window.fetch_with_str(url)).await?.into();
    let array_buffer: ArrayBuffer = JsFuture::from(response.array_buffer()?).await?.into();

    let data: Uint8Array = Uint8Array::new(&array_buffer.into());

    Ok(Cursor::new(data.to_vec()))
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
        pub fn new(data: Float32Array, shape: Array) -> Tensor {
            Tensor::from_shape_vec(data.to_vec(), shape)
        }

        pub fn data(&self) -> JsValue {
            let view = self.inner.to_array_view().unwrap();
            let slice = view.as_slice().unwrap();

            match self.inner.datum_type() {
                DatumType::F32 => Float32Array::from(slice).into(),
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

        let model = onnx().model_for_read(&mut reader).unwrap();
        let mut model = model.into_optimized().unwrap();

        model.auto_outputs().unwrap();
        let plan = SimplePlan::new(model).unwrap();

        Ok(Model { plan })
    }

    pub fn predict(&self, data: js_tensor::Tensor) -> js_tensor::Tensor {
        let outputs = self.plan.run(tvec![data.inner()]).unwrap();
        js_tensor::Tensor::from_tract_tensor((*outputs[0]).clone())
    }
}
