import { getInfo } from '@/api/inf'
import { getMatchInfos } from '@/api/jad'
import { getTheoryMatchInfos } from '@/api/theory'
import { getAttackMatchInfos } from '@/api/attack'
import { getNewADMatchInfos } from '@/api/newAD'
import { rwMatchInfo } from '@/api/rw'
import { getDevopsInfo } from '@/api/devops'

const getDefaultState = () => {
  return {
    match: {
      event_mode: ''
    } // 比赛的配置信息
  }
}

const state = getDefaultState()

const mutations = {
  SET_MATCH: (state, match) => {
    state.match = match
  },
  SET_REMAIN_SECONDS: (state, remain_seconds) => {
    state.match.remain_seconds = remain_seconds
  }
}

const actions = {
  // 获取渗透赛竞赛信息
  getInfInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
      getInfo(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取解题赛竞赛信息
  getjadInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
      getMatchInfos(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取理论赛竞赛信息
  getTheoryInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
      getTheoryMatchInfos(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取攻防赛竞赛信息
  getAttackInfo({ commit }, params) {
    return new Promise((resolve, reject) => {
      getAttackMatchInfos(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取新攻防赛竞赛信息
  getNewADMatchInfos({ commit }, params) {
    return new Promise((resolve, reject) => {
      getNewADMatchInfos(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取rw竞赛信息
  getRwMatchInfos({ commit }, params) {
    return new Promise((resolve, reject) => {
      rwMatchInfo(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取运维赛竞赛信息
  getDevopsInfos({ commit }, params) {
    return new Promise((resolve, reject) => {
      getDevopsInfo(params).then(response => {
        const {
          data
        } = response
        commit('SET_MATCH', data)
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
