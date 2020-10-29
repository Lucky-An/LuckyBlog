import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import chartsRouter from './modules/charts'
import itemBankRouter from './modules/itemBank'
import competitionRouter from './modules/competition'
import account from './modules/account'
import systemManage from './modules/systemManage'
import systemDevOps from './modules/systemDevOps'
import imageRouter from './modules/imageRouter'
import toolRouter from './modules/toolRouter'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    beforeEnter: (to, from, next) => {
      if (store.getters.roles[0] == 'referee') {
        next('/competition/rw/index')
      } else {
        next('/dataCenter/dashboard')
      }
    }
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // mode: 'history',
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/dataCenter',
    component: Layout,

    meta: {
      icon: 'dashboard',
      roles: ['admin', 'teacher']
    },

    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/home/admin/statistics'),
        name: 'dashboard',
        meta: { title: '数据中心' }
      }
    ]
  },
  // {
  //   path: '/Icons',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  itemBankRouter,
  account,
  competitionRouter,
  systemDevOps,
  systemManage,

  imageRouter,
  toolRouter,

  // chartsRouter,

  { path: '*', redirect: '/404', hidden: true }
]

