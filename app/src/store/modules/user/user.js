const url = 'http://127.0.0.1:8000/api/message/publish'

const state = {
    loggedIn: null !== localStorage.getItem('token'),
    user: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
    },
    form: {
        dialog: false,
        createLoading: false,
        title: '',
        titleIcon: '',
        editedIndex: -1,
        editedItem: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
        },
        defaultItem: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
        },
    },
    table: {
        totalItems: 0,
        items: [],
        options: {},
        loading: false,
        search: ''
    },
    snackbar: {
        show: false,
        title: null,
        text: null,
        color: null,
        icon: null,
        mode: null,
        timeout: 7000,
    }
};

const getters = {
    isAuthenticated: state => {
        return !!state.loggedIn
    },
    table: state => {
        return state.table
    },
    form: state => {
        return state.form
    },
    user: state => {
        return state.user
    },
    snackbar: state => {
        return state.snackbar
    },
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
        }

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
    },
    async addUser({commit}) {
        const data = {
            channel: "create_user",
            payload: {
                firstName: this.getters.user.firstName,
                lastName: this.getters.user.lastName,
                username: this.getters.user.username,
                email: this.getters.user.email,
                password: this.getters.user.password,
            }
        }

        const options = {
            method: 'POST',
            body: getFormDataFromData(data),
            headers: new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')})
        }

        await fetch(url, options)
            .then(response => {
                const json = response.json()
                json.then(data => {
                    console.log(data.messageId)

                    commit('resetUser');
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
        state.table.items = items
    },
    totalItems(state, totalItems) {
        state.table.totalItems = totalItems
    },
    loading(state, isLoading) {
        state.table.loading = isLoading
    },
    createLoading(state, isLoading) {
        state.form.createLoading = isLoading
    },
    search(state, search) {
        state.table.search = search
    },
    formTitle(state) {
        state.form.title = state.form.editedIndex === -1 ? 'New user' : 'Edit user'
    },
    formTitleIcon(state) {
        state.form.titleIcon = state.form.editedIndex === -1 ? 'mdi-account-plus' : 'mdi-account-edit'
    },
    formDialog(state, isActive) {
        state.form.dialog = isActive
    },
    editedItem(state, editedItem) {
        state.form.editedItem = editedItem
    },
    editedIndex(state, index) {
        state.form.editedIndex = index
    },
    resetUser(state) {
        state.user.firstName = ''
        state.user.lastName = ''
        state.user.username = ''
        state.user.email = ''
        state.user.password = ''
        state.user.passwordRepeat = ''
    },
    setSnackbar(state, payload) {
        state.snackbar.title = payload.title
        state.snackbar.text = payload.text
        state.snackbar.icon = payload.icon
        state.snackbar.color = payload.color
        state.snackbar.show = payload.show
    }
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