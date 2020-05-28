<template>
  <div class="d-flex flex-column">
    <h1 class="headline">SqueezeNet Inference</h1>
    <div class="d-flex justify-center flex-wrap">
      <div class="ma-4 d-flex flex-column justify-space-around" :style="{ width: width + 'px'}">
        <v-select
          class="pa-0 shrink"
          hide-details
          label="Select image"
          :items="items"
          prepend-icon="mdi-image"
        />
        <p class="mx-0 ma-4 mb-2 overline align-self-center">- or -</p>
        <v-file-input class="pa-0 shrink" hide-details label="Upload image" />
      </div>
      <v-card :height="height" class="mx-2">
        <canvas id="canvas" :height="height" :width="width"></canvas>
      </v-card>
    </div>
    <v-btn color="primary" class="ma-8 align-self-center" x-large>Predict</v-btn>
    <v-container v-if="output" class="shrink align-self-center" fluid>
      <v-row>
        <v-col class="body-1 font-weight-bold">Inference time:</v-col>
        <v-col class="text-right font-weight-regular">{{output.time}}ms</v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="body-1 font-weight-bold ma-0">Predictions:</p>
        </v-col>
        <v-col
          class="text-right"
        >{{output.predictions[0].label}}: {{output.predictions[0].score*100}}%</v-col>
      </v-row>
      <v-row v-for="(pred, i) in output.predictions.slice(1)" :key="i">
        <v-col></v-col>
        <v-col class="text-right">{{pred.label}}: {{pred.score*100}}%</v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SqueezenetDemo",
  data: () => ({
    width: 224,
    height: 224,
    items: ["Cat", "Dog", "Cheetah", "Bird"],
    output: null
  })
};
</script>

<style scoped lang="scss">
.container {
  max-width: 20rem;

  .col {
    padding: 0.1em;
  }
}
</style>