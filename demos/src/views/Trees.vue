<template>
  <div class="d-flex justify-center pa-8">
    <div class="tree-container">
      <h1 class="headline mb-2">Running XGBoost / LightGBM models</h1>
      <p>
        tractjs can now run Decision Tree Classifiers and Regressors! This demo
        shows how to export the models to ONNX and run them on the client-side
        in your browser via WASM through tractjs.
      </p>
      <h4>
        Input (from the
        <a href="https://en.wikipedia.org/wiki/Iris_flower_data_set"
          >Iris dataset</a
        >):
      </h4>
      <v-simple-table class="mb-4" dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="column in columns" :key="column" class="text-left">
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(val, i) in sample" :key="i">
                <v-text-field
                  v-model="sample[i]"
                  hide-details
                  single-line
                  type="number"
                >
                </v-text-field>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <h4>Prediction (LightGBM tree):</h4>
      <v-simple-table class="mb-16" dense>
        <template v-slot:default>
          <thead v-if="output != null">
            <tr>
              <th
                v-for="column in Object.keys(output)"
                :key="column"
                class="text-left"
              >
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody v-if="output != null">
            <tr>
              <td
                v-for="[val, i] in Object.values(output).map((x, i) => [x, i])"
                :key="i"
              >
                {{ Math.round(val * 1000) / 1000 }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row class="align-center mt-12">
        <v-col>
          <h2>Using classifiers</h2>
        </v-col>
        <v-spacer />
        <v-col md="2" class="pb-0">
          <v-select
            height="3em"
            :items="Object.keys(classifierUsage)"
            label="Framework"
            v-model="selected"
          >
            <template slot="item" slot-scope="data"> {{ data.item }} </template
            ><template slot="selection" slot-scope="data">
              {{ data.item }}
            </template></v-select
          >
        </v-col>
      </v-row>
      <markdown-it-vue :content="classifierUsage[selected]['code']" />
      <markdown-it-vue class="mt-4" :content="classifierMd" />
      <v-row class="align-center mt-12">
        <v-col>
          <h2>Using regressors</h2>
        </v-col>
        <v-spacer />
        <v-col md="2" class="pb-0">
          <v-select
            height="3em"
            :items="Object.keys(regressorUsage)"
            label="Framework"
            v-model="selected"
          >
            <template slot="item" slot-scope="data"> {{ data.item }} </template
            ><template slot="selection" slot-scope="data">
              {{ data.item }}
            </template></v-select
          >
        </v-col>
      </v-row>
      <markdown-it-vue :content="regressorUsage[selected]['code']" />
      <markdown-it-vue class="mt-4" :content="regressorMd" />
      <p>
        Tested with:
        <pre>
    xgboost==1.3.1
    onnx==1.8.0
    onnxmltools==1.7.0
    scikit-learn==0.23.2
    lightgbm==3.1.1
    hummingbird-ml==0.2.1
    torch==1.7.0
        </pre>
      </p>
    </div>
  </div>
</template>

<script>
import * as tractjs from "tractjs";
import xgboostClassifierUsage from "@/assets/xgboost_classifier.md";
import lightGBMClassifierUsage from "@/assets/lightgbm_classifier.md";
import classifierMd from "@/assets/classifier.md";
import xgboostRegressorUsage from "@/assets/xgboost_regressor.md";
import lightGBMRegressorUsage from "@/assets/lightgbm_regressor.md";
import regressorMd from "@/assets/regressor.md";
import "highlight.js/styles/github.css";

function rURL(src) {
  // this makes sure it works both locally and on gh-pages
  return window.location.href.replace(/\/$/, "") + "/" + src;
}

export default {
  name: "Trees",
  data: () => ({
    columns: [
      "sepal length (cm)",
      "sepal width (cm)",
      "petal length (cm)",
      "petal width (cm)",
    ],
    labelNames: ["setosa", "versicolor", "virginica"],
    sample: [
      // this is just the first sample in the wine dataset
      5.1,
      3.5,
      1.4,
      0.2,
    ].map((x) => Math.round(x * 100) / 100),
    model: null,
    output: null,
    selected: "LightGBM",
    classifierUsage: {
      LightGBM: {
        code: lightGBMClassifierUsage,
      },
      XGBoost: {
        code: xgboostClassifierUsage,
      },
    },
    classifierMd,
    regressorUsage: {
      LightGBM: {
        code: lightGBMRegressorUsage,
      },
      XGBoost: {
        code: xgboostRegressorUsage,
      },
    },
    regressorMd,
  }),
  created() {
    this.model = tractjs.load(rURL("model.onnx"), {
      inputFacts: {
        0: ["float32", ["s", this.columns.length]],
      },
      outputs: ["probabilities"],
    });
    this.model.then((model) => {
      this.predict(model);
    });
  },
  watch: {
    sample: {
      handler: async function () {
        let model = await this.model;

        this.predict(model);
      },
    },
  },
  methods: {
    async predict(model) {
      let tensor = new tractjs.Tensor(new Float32Array(this.sample), [
        1,
        this.columns.length,
      ]);
      let preds = await model.predict([tensor], { s: 1 });
      // .predict returns an array of tensors, we are interested in the data of the first output
      this.output = Object.fromEntries(
        Array.from(preds[0].data).map((x, i) => [this.labelNames[i], x])
      );
    },
  },
};
</script>

<style>
.tree-container input {
  padding: 0;
  margin: 0;
  font-size: 0.875em;
}

.tree-container .v-text-field {
  padding: 0;
}

.tree-container {
  max-width: 100%;
  width: 50rem;
}
</style>