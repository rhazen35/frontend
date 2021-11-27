const state = {
    topics: []
};

const getters = {
    topics() {
        return state.topics
    },
    hasTopic: (state) => (topic) => {
        return state.topics.includes(topic)
    },
};

const actions = {
    addTopic({commit}, topic) {
        commit('topic', topic);
    },
};

const mutations = {
    topic(state, topic) {
        state.topics.push(topic)
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
}