<template>
  <div>
    <p class="body-1">
      Run ONNX and TensorFlow inference in the browser. A thin wrapper on top of
      <a href="https://github.com/snipsco/tract">tract</a>.
    </p>
    <h2 class="display-1">Benchmarks</h2>
    <Benches />
    <h2 class="display-1">Demos</h2>
    <div class="d-flex flex-wrap mt-2 mb-6 pl-1">
      <v-hover v-slot:default="{ hover }" v-for="(demo, i) in demos" :key="i">
        <v-card
          :href="demo.href"
          min-height="110"
          width="300"
          class="ma-2 ml-0"
          :elevation="hover ? 4 : 2"
        >
          <v-card-title>{{ demo.title }}</v-card-title>
          <v-card-subtitle>{{ demo.text }}</v-card-subtitle>
        </v-card>
      </v-hover>
    </div>
    <h2 class="display-1">Resources</h2>
    <v-list>
      <v-list-item v-for="(resource, i) in resources" :key="i" class="pa-0">
        <v-btn class="pl-1" text :href="resource.href">
          <span class="body-1 custom-transform-class text-none mr-2">{{
            resource.title
          }}</span>
          <v-icon color="primary">mdi-open-in-new</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import config from "../../vue.config";
import Benches from "./Benches.vue";

export default {
  name: "App",
  components: {
    Benches,
  },
  data: () => ({
    demos: [
      {
        title: "SqueezeNet inference",
        text: "Run SqueezeNet, trained on ImageNet, in the browser.",
        href: "squeezenet",
      },
      {
        title: "Custom model inference",
        text: "Upload a .onnx file and run data through it.",
        href: "custom-model",
      },
    ],
    resources: [
      {
        title: "tractjs API documentation",
        href: config.publicPath + "docs",
      },
      {
        title: "tractjs on Github",
        href: "https://github.com/bminixhofer/tract-js",
      },
      {
        title: "tract on Github",
        href: "https://github.com/snipsco/tract",
      },
      {
        title: "tract on docs.rs",
        href: "https://docs.rs/tract-core/0.6.3/tract_core/",
      },
    ],
  }),
};
</script>
