const state = {
    progressCircularColor: 'primary',
    progressCircularColors: ['amber', 'red', 'purple', 'green', 'primary'],
};

const getters = {
    progressCircularColor: state => {
        return state.progressCircularColor
    }
};

const actions = {
};

const mutations = {
};

export default {
    state,
    getters,
    actions,
    mutations,
}