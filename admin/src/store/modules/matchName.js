const matchName = {
  state: {
    matchName: ''
  },
  mutations: {
    CHANGE_MATCH_NAME: (state, name) => {
      state.matchName = name
    }
  },
  actions: {
    changeMatchName({ commit }, name) {
      commit('CHANGE_MATCH_NAME', name)
    }
  }
}

export default matchName
