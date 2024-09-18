const store = {
    state: () => ({
        device: 'desktop',
        test: '123123123',
    }),
    mutations: {
        setTestValue(state) {
            state.test = 123
        },

        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
    },
    actions: {
        toggleDevice({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
    }
}

export default store