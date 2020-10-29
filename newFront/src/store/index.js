import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import config from './modules/config'
import match from './modules/match'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    config,
    user,
    match
  },
  getters
})

export default store
