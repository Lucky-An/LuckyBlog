import { login, logout, getInfo } from '@/api/login'
import router from '@/router'

const getDefaultState = () => {
  return {
    team: {}, // 用户队伍信息
    user: {}, // 用户个人信息
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TEAM: (state, team) => {
    state.team = team
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, ruleForm) {
    return new Promise((resolve, reject) => {
      login(ruleForm).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 如果url是从观摩页来的，那么不请求用户信息。
      if (location.href.includes('watch=true')) {
        resolve()
      } else {
        getInfo(state.token).then(response => {
          const { user_data } = response.data

          commit('SET_USER', user_data.user)
          commit('SET_TEAM', user_data.team)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('RESET_STATE')
        router.push('/login')
        resolve()
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

