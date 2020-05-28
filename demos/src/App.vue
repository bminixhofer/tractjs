<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <h1 class="white--text font-weight-regular">tract-js</h1>
        </router-link>
      </div>
    </v-app-bar>

    <v-content class="ma-4">
      <router-view />
    </v-content>
  </v-app>
</template>