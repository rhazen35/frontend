const url = 'http://127.0.0.1:8000/api/message/publish'

const state = {
    loggedIn: false
};

const getters = {
    isAuthenticated() {
        return !!state.loggedIn
    }
};

const actions = {
    async authenticate({commit}, payload) {
        const formData = new FormData();
        const data = {
            channel: "authenticate_user",
            payload: {
                email: payload.username,
                password: payload.password
            }
        };

        for(let dataKey in data) {
            if(dataKey === 'payload') {
                for (let payloadKey in data[dataKey]) {
                    formData.append(`payload[${payloadKey}]`, data[dataKey][payloadKey]);
                }
            }
            else {
                formData.append(dataKey, data[dataKey]);
            }
        }

        const options = {
            method: 'POST',
            body: formData
        };

        await fetch(url, options)
            .then(response => {
                const json = response.json();
                json.then(data => {
                    console.log(data.messageId);
                });
            })
            .catch(errors => {
                console.log(errors);
                commit('removeTokenFromStorage');
            });
    },
    login ({commit}, token) {
        localStorage.setItem('token', token);
        commit('loggedIn');
    },
    logout ({commit})  {
        localStorage.removeItem('token');
        commit('loggedOut');
    },
};

const mutations = {
    loggedIn(state) {
        state.loggedIn = true;
    },
    loggedOut(state) {
        state.loggedIn = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
}