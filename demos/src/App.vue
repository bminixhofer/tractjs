<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <h1 class="white--text font-weight-regular">tractjs</h1>
        </router-link>
      </div>
      <v-spacer />
      <a href="https://github.com/bminixhofer/tractjs">
        <v-img
          alt="bminixhofer/tractjs on Github"
          max-height="2.4rem"
          max-width="2.4rem"
          src="./assets/GitHub-Mark.svg"
        />
      </a>
    </v-app-bar>

    <v-content class="ma-4">
      <router-view />
    </v-content>
  </v-app>
</template>
