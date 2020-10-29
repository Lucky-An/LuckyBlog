import { getConfig } from '@/api/login'
import { parseTime } from '@/utils'

const user = {
  state: {
    row: 10, // 全局表格行数
    time: '', // 系统时间
    role_name: 'admin', // 角色名称
    timer: '',
    home_page_logo: ''
  },

  mutations: {
    SET_ROW: (state, row) => {
      // state.row = row
    },
    SET_TIME: (state, time) => {
      state.time = time
    },
    SET_RULE_NAME: (state, role_name) => {
      state.role_name = role_name
    },
    SET_TIMER: (state, timer) => {
      state.timer = timer
    },
    SET_HOME_PAGE_LOGO: (state, home_page_logo) => {
      state.home_page_logo = home_page_logo
    }
  },

  actions: {
    // 获取全局配置
    getConfig({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        getConfig(userInfo).then(response => {
          if (this.state.config.timer) {
            clearInterval(this.state.config.timer)
          }

          const data = response.data

          let time = data.time

          const timer = setInterval(() => {
            commit('SET_TIME', parseTime(time))
            time++
          }, 1000)

          commit('SET_TIMER', timer)
          commit('SET_ROW', data.global_table_rows)
          commit('SET_RULE_NAME', data.role_name)
          commit('SET_HOME_PAGE_LOGO', data.home_page_logo)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default user
