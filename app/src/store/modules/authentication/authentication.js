import {url, getFormDataFromData} from '../../../utils/helpers/request/requestHelper'
import router from "../../../router/index";

export default {
    namespaced: true,
    state: () => ({
        loggedIn: null !== localStorage.getItem('token'),
        loginExpiredDialog: false,
        form: {
            username: null,
            password: null,
            showOverlay: false,
            absoluteOverlay: true,
            invalidForm: true,
        },
        errors: {
            global: '',
        },
        snackbar: {
            show: false,
            title: null,
            text: null,
            color: null,
            icon: null,
            mode: null,
            timeout: 7000,
        },
    }),
    getters: {
        isAuthenticated: state => {
            return !!state.loggedIn
        },
        loginExpiredDialog: state => {
            return state.loginExpiredDialog
        },
        form: state => {
            return state.form
        },
        errors: state => {
            return state.errors
        },
        snackbar: state => {
            return state.snackbar
        },
    },
    actions: {
        async authenticate({commit}, payload) {
            const data = {
                channel: "authenticate_user",
                payload: {
                    email: payload.username,
                    password: payload.password
                }
            };

            const options = {
                method: 'POST',
                body: getFormDataFromData(data)
            };

            await fetch(url, options)
                .then(response => {
                    const json = response.json();
                    json.then(data => {
                        //TODO: Return the message id as to pin point it to the originated message
                        // Save the id in the state an match when handling the authentication
                        console.log(data.messageId)
                    });
                })
                .catch(errors => {
                    //TODO: Handle errors
                    console.log(errors)
                    commit('removeTokenFromStorage')
                });
        },
        login ({commit}, token) {
            localStorage.setItem('token', token)
            commit('loggedIn')
            if (router.currentRoute.path !== '/') {
                router.push('/')
            }
        },
        logout ({commit})  {
            localStorage.removeItem('token')
            commit('loggedOut');
        },
    },
    mutations: {
        loggedIn(state) {
            state.loggedIn = true
        },
        loggedOut(state) {
            state.loggedIn = false
        },
        loginExpiredDialog(state, show) {
            state.loginExpiredDialog = show
        },
        showOverlay(state, show) {
            state.form.showOverlay = show
        },
        invalidForm(state, invalid) {
            state.form.invalidForm = invalid
        },
        globalError(state, error) {
            state.errors.global = error
        },
        snackbar(state, payload) {
            state.snackbar.title = payload.title
            state.snackbar.text = payload.text
            state.snackbar.color = payload.color
            state.snackbar.icon = payload.icon
            state.snackbar.show = payload.show
        }
    },
}