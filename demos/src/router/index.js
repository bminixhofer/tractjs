import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/squeezenet',
    name: 'Squeezenet',
    component: () => import(/* webpackChunkName: "squeezenet" */ '../views/Squeezenet.vue')
  },
  {
    path: '/custom-model',
    name: 'CustomModel',
    component: () => import(/* webpackChunkName: "custom_model" */ '../views/CustomModel.vue')
  },
  {
    path: "*",
    name: "404",
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
