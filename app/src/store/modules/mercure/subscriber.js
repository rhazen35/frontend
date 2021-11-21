const state = {
    topics: [],
    eventSource: null
};

const getters = {
    getTopics() {
        return state.topics
    },
    hasTopic: (state) => (topic) => {
        return state.topics.includes(topic)
    },
    getEventSource() {
        return state.eventSource
    }
};

const actions = {
    addToTopics({commit}, topic) {
        commit('addTopic', topic);
    },
    setEventSource({commit}, eventSource) {
        commit('addEventSource', eventSource);
    }
};

const mutations = {
    addTopic(state, topic) {
        state.topics.push(topic)
    },
    addEventSource(state, eventSource) {
        state.eventSource = eventSource
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
}