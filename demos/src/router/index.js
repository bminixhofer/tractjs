import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';
import routeData from "./routes.json";

Vue.use(VueRouter);

const routes = routeData.map((route) => {
  let component;

  switch (route.path) {
    case "/": component = Home; break;
    case "/squeezenet": component = () => import(/* webpackChunkName: "squeezenet" */ '../views/Squeezenet.vue'); break;
    case "/trees": component = () => import(/* webpackChunkName: "trees" */ '../views/Trees.vue'); break;
    case "/custom-model": component = () => import(/* webpackChunkName: "custom_model" */ '../views/CustomModel.vue'); break;
    case "*": component = NotFound;
  }

  route.component = component;
  return route;
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, _, next) => {
  const nearestWithTitle = to.matched.reverse().find(r => r.meta && r.meta.title);

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }

  next();
});

export default router;
