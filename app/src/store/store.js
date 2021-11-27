import Vue from "vue";
import Vuex from 'vuex';
import user from "./modules/user/user";
import form from "./form/form";
import mercureSubscriber from "./modules/mercure/subscriber";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        form,
        mercureSubscriber,
    },
})

export default store