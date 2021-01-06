<template>
  <div class="d-flex flex-column">
    <h1 class="headline">SqueezeNet Inference</h1>
    <div class="d-flex justify-center flex-wrap">
      <div
        class="ma-4 d-flex flex-column justify-space-around"
        :style="{ width: width + 'px' }"
      >
        <v-select
          @change="select"
          ref="select"
          class="pa-0 shrink"
          hide-details
          label="Select image"
          :items="items"
          prepend-icon="mdi-image"
        />
        <p class="mx-0 ma-4 mb-2 overline align-self-center">- or -</p>
        <v-file-input
          @change="upload"
          ref="upload"
          class="pa-0 shrink"
          hide-details
          label="Upload image"
        />
      </div>
      <v-card :height="height" class="mx-2">
        <canvas ref="canvas" :height="height" :width="width"></canvas>
      </v-card>
    </div>
    <v-btn
      :disabled="!canRun"
      @click="run"
      color="primary"
      class="ma-8 align-self-center"
      x-large
      >Predict</v-btn
    >
    <v-container v-if="output" class="shrink align-self-center" fluid>
      <v-row>
        <v-col class="body-1 font-weight-bold">Inference time:</v-col>
        <v-col class="text-right font-weight-regular"
          >{{ Math.round(output.time) }}ms</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <p class="body-1 font-weight-bold ma-0">Predictions:</p>
        </v-col>
        <v-col class="text-right"
          >{{ output.predictions[0].label }}:
          {{ Math.round(output.predictions[0].score * 100) }}%</v-col
        >
      </v-row>
      <v-row v-for="(pred, i) in output.predictions.slice(1)" :key="i">
        <v-col></v-col>
        <v-col class="text-right"
          >{{ pred.label }}: {{ Math.round(pred.score * 100) }}%</v-col
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
import * as tractjs from "tractjs";

function rURL(src) {
  // this makes sure it works both locally and on gh-pages
  return window.location.href.replace(/\/$/, "") + "/" + src;
}

function drawImage(src, canvas) {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };
}

function getData(canvas) {
  const ctx = canvas.getContext("2d");
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const means = [0.485, 0.456, 0.406];
  const stds = [0.229, 0.224, 0.225];
  const nPixels = data.length / 4;

  const output = new Float32Array(nPixels * 3);
  let index = 0;

  for (let i = 0; i < 3; i++) {
    // channels
    for (let j = 0; j < canvas.height; j++) {
      // height
      for (let k = 0; k < canvas.width; k++) {
        // width
        let datum = data[(j * canvas.width + k) * 4 + i];
        output[index] = (datum / 255 - means[i]) / stds[i];
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

function getTopK(preds, k) {
  let indices = Array.from(preds).map((x, i) => [x, i]);
  indices.sort((a, b) => b[0] - a[0]);

  return indices.slice(0, k);
}

export default {
  name: "SqueezenetDemo",
  data: () => ({
    width: 224,
    height: 224,
    k: 5,
    items: [
      {
        text: "Cat",
        value: rURL("cat.png"),
      },
      {
        text: "Dog",
        value: rURL("dog.png"),
      },
      {
        text: "Cheetah",
        value: rURL("cheetah.png"),
      },
      {
        text: "Bird",
        value: rURL("bird.png"),
      },
    ],
    output: null,
    model: null,
    labels: [],
  }),
  computed: {
    canRun() {
      return this.model !== null && this.labels.length > 0;
    },
  },
  async created() {
    this.model = await tractjs.load(rURL("squeezenet1_1.onnx"));

    const response = await fetch(rURL("synset.txt"));
    if (response.status < 200 && response.status >= 300) {
      return;
    }
    const text = await response.text();

    text.split("\n").forEach((line) => {
      if (line.trim().length == 0) {
        return;
      }

      let label = line.split(" ").slice(1).join(" ").split(",")[0];
      this.labels.push(label);
    });
  },
  methods: {
    upload(file) {
      if (file !== null) {
        drawImage(URL.createObjectURL(file), this.$refs.canvas);
        this.$refs.select.internalValue = null;
      }
    },
    select(url) {
      if (url !== null) {
        this.$refs.upload.internalValue = null;
        drawImage(url, this.$refs.canvas);
      }
    },
    async predict(input, shape) {
      let inputTensor = new tractjs.Tensor(input, shape);
      let outputTensor = (await this.model.predict([inputTensor]))[0];

      let preds = softmax(outputTensor.data);
      return preds;
    },
    async run() {
      const [input, shape] = getData(this.$refs.canvas);

      let startTime = performance.now();
      const preds = await this.predict(input, shape);
      let endTime = performance.now();

      const topK = getTopK(preds, this.k);
      this.output = {
        time: endTime - startTime,
        predictions: topK.map(([score, index]) => ({
          label: this.labels[index],
          score,
        })),
      };
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  max-width: 30rem;

  .col {
    padding: 0.1em;
  }
}
</style>