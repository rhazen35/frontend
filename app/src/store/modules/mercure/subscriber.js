export default {
    namespaced: true,
    state: {
        topics: []
    },
    getters: {
        topics(state) {
            return state.topics
        },
        hasTopic: (state) => (topic) => {
            return state.topics.includes(topic)
        },
    },
    actions: {
        addTopic({commit}, topic) {
            commit('topic', topic);
        },
    },
    mutations: {
        topic(state, topic) {
            state.topics.push(topic)
        },
    }
}