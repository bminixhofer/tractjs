use js_sys::{ArrayBuffer, Uint8Array};
use std::io::{Cursor, Read};
use tract_onnx::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::Response;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

async fn fetch(url: &str) -> Result<impl Read, JsValue> {
    let window = web_sys::window().expect("couldn't get window object");
    let response: Response = JsFuture::from(window.fetch_with_str(url)).await?.into();
    let array_buffer: ArrayBuffer = JsFuture::from(response.array_buffer()?).await?.into();

    let data: Uint8Array = Uint8Array::new(&array_buffer.into());

    Ok(Cursor::new(data.to_vec()))
}

#[wasm_bindgen]
pub async fn load(url: String) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();

    let mut reader = fetch(&url).await?;
    let mut model = onnx().model_for_read(&mut reader).unwrap();
    model.auto_outputs().unwrap();

    alert(&format!("{:#?}", model));
    Ok(())

    // let outlet_id = model.find_outlet_label("output").unwrap();

    // let plan = SimplePlan::new_for_output(&model, outlet_id).unwrap();
    // let array: Tensor = tract_ndarray::Array2::<f32>::zeros((1, 1)).into();

    // let result = plan.run(tvec!(array)).unwrap();
    // let output = result[0].to_array_view::<f32>().unwrap();

    // // alert(&format!("{:#?}", output));
}
