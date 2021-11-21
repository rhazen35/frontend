import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from "./store/store";
import mercureSubscriber from "./utils/mercure/subscriber";

Vue.config.productionTip = false

Object.defineProperty(Vue.prototype, '$mercureSubscriber', {
  get () {
    return mercureSubscriber
  }
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
