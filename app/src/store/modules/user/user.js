import { getField, updateField } from 'vuex-map-fields';

const url = 'http://127.0.0.1:8000/api/message/publish'

const state = {
    loggedIn: null !== localStorage.getItem('token'),
    totalItems: 0,
    items: [],
    loading: false,
    search: ''
};

const getters = {
    isAuthenticated: state => {
        return !!state.loggedIn
    },
    loading: state => {
        return state.loading
    },
    items: state => {
        return state.items
    },
    totalItems: state => {
        return state.totalItems
    },
    search: state => {
        return state.search
    },
    getField
};

const actions = {
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
                    // TODO: Return the message id as to pin point it to the originated message
                    console.log(data.messageId)
                });
            })
            .catch(errors => {
                // TODO: Handle errors
                console.log(errors)
                commit('removeTokenFromStorage')
            });
    },
    login ({commit}, token) {
        localStorage.setItem('token', token)
        commit('loggedIn')
    },
    logout ({commit})  {
        localStorage.removeItem('token')
        commit('loggedOut');
    },
    async getUsers(_, payload) {
        const data = {
            channel: "get_users",
            payload: {
                page: payload.page,
                limit: payload.itemsPerPage
            }
        };

        if ('' !== payload.search) {
            data.payload.search = payload.search
        }

        if (0 !== payload.sortBy.length) {
            data.payload.sortBy = payload.sortBy
        }

        if (0 !== payload.sortOrder.length) {
            data.payload.sortOrder = payload.sortOrder
        }

        const options = {
            method: 'POST',
            body: getFormDataFromData(data),
            headers: new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')})
        };

        await fetch(url, options)
            .then(response => {
                const json = response.json()
                json.then(data => {
                    console.log(data.messageId)
                });
            })
            .catch(errors => {
                // TODO: Handle errors
                console.log(errors)
            });
    }
};

const mutations = {
    loggedIn(state) {
        state.loggedIn = true
    },
    loggedOut(state) {
        state.loggedIn = false
    },
    items(state, items) {
        state.items = items
    },
    totalItems(state, totalItems) {
        state.totalItems = totalItems
    },
    loading(state, isLoading) {
        state.loading = isLoading
    },
    search(state, search) {
        state.search = search
    },
    updateField
};

function getFormDataFromData(data) {
    const formData = new FormData();
    for (let dataKey in data) {
        if(dataKey === 'payload') {
            for (let payloadKey in data[dataKey]) {
                const dataItem = !Array.isArray(data[dataKey][payloadKey]) ? data[dataKey][payloadKey] : JSON.stringify(data[dataKey][payloadKey])
                formData.append(`payload[${payloadKey}]`, dataItem);
            }
        }
        else {
            formData.append(dataKey, data[dataKey]);
        }
    }

    return formData;
}

export default {
    state,
    getters,
    actions,
    mutations,
}