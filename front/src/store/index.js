import Vue from 'vue'
import Vuex from 'vuex'

import match from './public/match'
import task from './public/task'

Vue.use(Vuex);

export default new Vuex.Store({
  state:{

  },
  mutations:{

  },
  modules:{
    match,
    task
  }
});
