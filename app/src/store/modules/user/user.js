import {url, getFormDataFromData} from '../../../utils/helpers/request/requestHelper'

export default {
    namespaced: true,
    state: () => ({
        user: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            passwordRepeat: "",
        },
        form: {
            mode: '',
            dialog: false,
            dialogDelete: false,
            createLoading: false,
            title: '',
            titleIcon: '',
            editedIndex: -1,
            editedItem: {
                id: "",
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
        },
    }),
    getters: {
        table: state => {
            return state.table
        },
        options: state => {
            return state.table.options
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
    },
    actions: {
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
                    firstName: this.getters['user/user'].firstName,
                    lastName: this.getters['user/user'].lastName,
                    username: this.getters['user/user'].username,
                    email: this.getters['user/user'].email,
                    password: this.getters['user/user'].password,
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
        },
        editDialog({commit}, payload) {
            commit('editedIndex', payload.editedIndex)
            commit('editedItem', payload.editedItem)
            commit('formDialog', payload.formDialog)
            commit('formTitle')
            commit('formTitleIcon')
            commit('mode')
        },
        async deleteUser() {
            const data = {
                channel: "delete_user",
                payload: {
                    id: this.getters['user/form'].editedItem.id,
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
                    });
                })
                .catch(errors => {
                    // TODO: Handle errors
                    console.log(errors)
                });
        }
    },
    mutations: {
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
        deleteDialog(state, isActive) {
            state.form.dialogDelete = isActive
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
        resetEditedItem(state) {
            state.form.editedItem.firstName = ''
            state.form.editedItem.lastName = ''
            state.form.editedItem.username = ''
            state.form.editedItem.email = ''
            state.form.editedIndex = -1
        },
        setSnackbar(state, payload) {
            state.snackbar.title = payload.title
            state.snackbar.text = payload.text
            state.snackbar.icon = payload.icon
            state.snackbar.color = payload.color
            state.snackbar.show = payload.show
        },
        mode(state) {
            state.form.mode = state.form.editedIndex === -1 ? 'create' : 'edit'
        }
    }
}