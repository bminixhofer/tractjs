import * as tractjs from "tractjs";

const canvas = document.querySelector("#canvas");;
const uploader = document.querySelector("#imageUpload");
const predictButton = document.querySelector("#predict");
const sampleImagesSelector = document.querySelector("#sampleImages");
const timeLabel = document.querySelector("#time");
const predList = document.querySelector("#predictions");

const modelPromise = new tractjs.Model("resources/squeezenet1_1.onnx");
const labelPromise = fetch("resources/synset.txt").then((response) => response.text()).then((text) => {
    const labels = [];

    text.split("\n").forEach((line) => {
        if (line.trim().length == 0) {
            return;
        }

        let label = line.split(" ").slice(1).join(" ").split(",")[0];
        labels.push(label);
    });

    return labels;
});

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

function softmax(logits) {
    const exp = logits.map((x) => Math.exp(x));
    const sum = exp.reduce((a, b) => a + b, 0);

    return exp.map((x) => x / sum);
}

function getTopK(preds, k = 5) {
    let indices = Array.from(preds).map((x, i) => [x, i]).sort((a, b) => b[0] > a[0]);
    return indices.slice(0, k);
}

async function predict(input, shape) {
    const model = await modelPromise;

    let inputTensor = new tractjs.Tensor(input, shape);
    let outputTensor = model.predict(inputTensor);

    let preds = softmax(outputTensor.data());
    return preds;
}

uploader.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        const img = new Image();
        img.src = URL.createObjectURL(this.files[0]);

        img.onload = function () {
            drawImage(img, canvas);
        }
    };
});

sampleImagesSelector.addEventListener("change", function () {
    let source = `resources/${this.value}.png`;

    const img = new Image();
    img.src = source;

    img.onload = function () {
        drawImage(img, canvas);
    }
});

predictButton.addEventListener("click", async () => {
    const [input, shape] = getData(canvas);

    let startTime = performance.now();
    const preds = await predict(input, shape);
    let endTime = performance.now();

    const top_k = getTopK(preds);
    const labels = await labelPromise;

    timeLabel.textContent = `${endTime - startTime} ms`;
    predList.innerHTML = "";

    top_k.forEach(([score, index]) => {
        const child = document.createElement("li");
        child.textContent = `${labels[index]}: ${Math.round(score * 100)}%`
        predList.appendChild(child);
    });
});