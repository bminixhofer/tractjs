<template>
  <div class="d-flex flex-column">
    <h1 class="headline">Custom model Inference</h1>
    <v-form v-model="valid">
      <v-container class="input">
        <v-row>
          <v-col class="input-name">
            <h2>Model</h2>
          </v-col>
          <v-col>
            <v-file-input v-model="file" class="small-input"></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="input-name">
            <h2>Rank</h2>
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="rank"
              min="0"
              :rules="[rules.integer]"
              class="small-input"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="input-name">
            <h2>Shape</h2>
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="dim.value"
              min="0"
              :rules="[rules.integer]"
              class="d-inline-block small-input mr-2"
              v-for="(dim, i) in shape"
              :key="i"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="input-name">
            <h2>Data type</h2>
          </v-col>
          <v-col>
            <v-select v-model="dataType" :items="Object.keys(dataTypes)" class="small-input"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="input-name">
            <h2>Initializer</h2>
          </v-col>
          <v-col>
            <v-select
              v-model="initializer"
              :items="Object.keys(dataTypes[dataType].initializers)"
              class="small-input"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-btn
      :disabled="!canRun"
      @click="run"
      color="primary"
      class="align-self-center"
      x-large
    >Predict</v-btn>
    <v-container class="output" v-if="output">
      <v-row>
        <v-col class="body-1 font-weight-bold ma-0">Inference time:</v-col>
        <v-col class="text-right">{{Math.round(output.time)}}ms</v-col>
      </v-row>
      <v-row>
        <v-col class="body-1 font-weight-bold ma-0">Output shape:</v-col>
        <v-col class="text-right">{{'(' + output.shape.join(', ') + ')'}}</v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import * as tractjs from "tractjs";

export default {
  data: () => ({
    rules: {
      integer: value =>
        (value == parseInt(value) && value >= 0) || "Must be >= 0."
    },
    dataTypes: {
      float32: {
        data: Float32Array,
        initializers: {
          "all zeros": () => 0
        }
      }
    },
    file: null,
    model: null,
    valid: false,
    dataType: "float32",
    initializer: "all zeros",
    rank: 3,
    shape: [],
    output: null
  }),
  watch: {
    rank: {
      immediate: true,
      handler() {
        while (this.rank > this.shape.length) {
          this.shape.push({
            value: 1
          });
        }

        while (Math.max(this.rank, 0) < this.shape.length) {
          this.shape.pop();
        }
      }
    },
    async file() {
      const url = URL.createObjectURL(this.file);

      this.model = await new tractjs.Model(url);
    }
  },
  computed: {
    canRun() {
      return this.model !== null && this.valid;
    }
  },
  methods: {
    async run() {
      const shape = this.shape.map(dim => dim.value);
      const nInputs = shape.reduce((a, b) => a * b, 1);
      const data = new this.dataTypes[this.dataType].data(nInputs);

      const tensorInput = new tractjs.Tensor(data, shape);
      let startTime = performance.now();
      const tensorOutput = (await this.model.predict([tensorInput]))[0];
      let endTime = performance.now();

      this.output = {
        time: endTime - startTime,
        shape: tensorOutput.shape
      };
    }
  },
  name: "CustomModelDemo"
};
</script>

<style scoped lang="scss">
.small-input {
  margin: 0;
  padding: 0;
  width: 6rem;
}

.col {
  padding: 0;
}

.input {
  .row {
    min-height: 3.4rem;
  }

  .col.input-name {
    font-weight: bold;
    text-align: right;
    font-size: 12px;
    padding-top: 0.1rem;
    margin-right: 2rem;
  }
}

.output {
  max-width: 30rem;

  .col {
    padding: 0.1em;
  }
}
</style>