import Vue from "vue"
import Vuex from 'vuex'
import authentication from "./modules/authentication/authentication"
import user from "./modules/user/user"
import mercureSubscriber from "./modules/mercure/subscriber"

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        authentication,
        user,
        mercureSubscriber,
    },
})

export default store