import * as tractjs from "tractjs";

const canvas = document.querySelector("#canvas");;
const uploader = document.querySelector("#imageUpload");

const modelPromise = new tractjs.Model("squeezenet1.0-8.onnx");

function drawImage(img, canvas) {
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, canvas.width, canvas.height);
}

function getData(canvas) {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const means = [0.485, 0.456, 0.406];
    const stds = [0.229, 0.224, 0.225];
    const nPixels = data.length / 4;

    const output = new Float32Array(nPixels * 3);
    let index = 0;

    for (let i = 0; i < 3; i++) { // channels
        for (let j = 0; j < canvas.height; j++) { // height
            for (let k = 0; k < canvas.width; k++) { // width
                let datum = data[(j * canvas.width + k) * 4 + i];
                output[index] = (datum / 255. - means[i]) / stds[i];
                index++;
            }
        }
    }

    return [output, [1, 3, canvas.height, canvas.width]];
}

async function predict(input, shape) {
    const model = await modelPromise;

    let inputTensor = new tractjs.Tensor(input, shape);
    let outputTensor = model.predict(inputTensor);

    console.log(outputTensor.shape());
}

uploader.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        const img = new Image();
        img.src = URL.createObjectURL(this.files[0]);

        img.onload = function () {
            drawImage(img, canvas);
            const [input, shape] = getData(canvas);

            predict(input, shape);
        }
    };
});
