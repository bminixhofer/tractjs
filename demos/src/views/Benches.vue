<template>
  <div>
    <p class="ma-0 mt-2">
      Notes: ONNX.js does not support LSTMs. tractjs only utilizes CPU.
    </p>
    <div class="d-flex flex-wrap mb-6 justify-center">
      <Plotly
        v-for="(bench, i) in benches"
        :key="i"
        :data="bench.data"
        :layout="bench.layout"
        :display-mode-bar="false"
      ></Plotly>
    </div>
    <p class="ma-0 caption text-right">Benchmark user agent: {{ userAgent }}</p>
    <p class="ma-0 caption text-right">Benchmark date: {{ benchDate }}</p>
  </div>
</template>

<script>
import { Plotly } from "vue-plotly";
import benchData from "../../../quality/benches/benches.json";

console.log(benchData);

export default {
  components: {
    Plotly,
  },
  data: () => ({
    userAgent: benchData.userAgent,
    benchDate: benchData.date,
    benches: benchData.results.map((bench) => {
      let x = Object.keys(bench.results);
      let y = Object.values(bench.results).map((values) => {
        return values.reduce((a, b) => a + b, 0) / values.length;
      });
      let errorY = Object.values(bench.results).map((values) => {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stddev =
          values.reduce((a, x) => a + Math.pow(x - mean, 2), 0) / values.length;
        const error = stddev / Math.sqrt(values.length);
        return error;
      });

      return {
        data: [
          {
            x,
            y,
            error_y: {
              type: "data",
              symmetric: false,
              array: errorY,
              // error bars cant reach into negative
              arrayminus: errorY.map((x, i) => Math.min(x, y[i])),
              visible: true,
            },
            marker: {
              color: [
                "#66BB6A",
                "#4372C1",
                "#4372C1",
                "#F44336",
                "#F44336",
                "#F44336",
              ],
            },
            type: "bar",
          },
        ],
        layout: {
          titlefont: {
            size: 12,
          },
          margin: {
            l: 50,
            r: 50,
          },
          width: 400,
          height: 400,
          title: bench.title,
          yaxis: {
            ticksuffix: "ms",
          },
          xaxis: {
            tickfont: {
              size: 10,
            },
          },
        },
      };
    }),
  }),
};
</script>

<style>
.svg-container {
  position: relative;
  max-width: 90vw;
}
</style>
