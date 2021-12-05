import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/store";
import Home from "../views/Home";
import About from "../views/About";
import AuthenticationRoutes from './authentication/routes';
import UserRoutes from './user/routes';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
    ...AuthenticationRoutes,
    ...UserRoutes,
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['authentication/isAuthenticated'];
  if (to.name !== 'Login' && !isAuthenticated) {
    return next({path: '/login'});
  }

  if (to.name === 'Login' && isAuthenticated) {
    return router.back();
  }

  next()
})

export default router
