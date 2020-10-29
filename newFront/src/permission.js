import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login', '/finals', '/finals', '/watchvhdsufvgsduigdsugvguisdgvusidviusdv']// 免登录白名单

router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)

  // store中是否存储了用户信息
  const hasUser = store.getters.user.nickname || store.getters.team.nickname
  const hasConfig = store.getters.user.nickname || store.getters.team.nickname

  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    if (hasUser && hasConfig) {
      next()
    } else {
      Promise.all([store.dispatch('config/getLogin'), store.dispatch('user/getInfo')]).then(res => {
        next()
      })
    }
  }
})

router.afterEach(() => {
  // finish progress bar
})
