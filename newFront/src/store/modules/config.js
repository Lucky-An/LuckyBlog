import { getLogin } from '@/api/login'

const getDefaultState = () => {
  return {
    config: {} // 整个系统的配置信息
  }
}

const state = getDefaultState()

const mutations = {
  SET_CONFIG: (state, config) => {
    state.config = config
  },
  SET_IS_TOOL: (state, is_tool) => {
    state.is_tool = is_tool
  },
  SET_IS_PERSONAL: (state, is_personal) => {
    state.is_personal = is_personal
  },
  SET_SHOW_ALL_EVT: (state, show_all_evt) => {
    state.show_all_evt = show_all_evt
  }
}

const actions = {
  // 获取登录信息和系统配置
  getLogin({ commit }) {
    return new Promise((resolve, reject) => {
      getLogin().then(response => {
        const { data } = response
        commit('SET_CONFIG', data)
        commit('SET_IS_TOOL', data.is_tool)
        commit('SET_IS_PERSONAL', data.is_personal)
        commit('SET_SHOW_ALL_EVT', data.show_all_evt)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

